import {Plugin, PluginKey} from "prosemirror-state";
import {Node} from "prosemirror-model";

export interface CharacterCountOptions {
    /**
     * The maximum number of characters that should be allowed. Defaults to `0`.
     */
    limit: number | null | undefined
    /**
     * The mode by which the size is calculated. Defaults to 'textSize'.
     */
    mode: 'textSize' | 'nodeSize'
}

export class CharacterCountPlugin {

    readonly options: CharacterCountOptions;

    constructor(options: CharacterCountOptions) {
        this.options = options;
    }

    addOptions(): CharacterCountOptions {
        return {
            limit: null,
            mode: 'textSize',
        }
    }

    initStorage() {
        return {
            characters: 0,
            words: 0,
        }
    }

    characters(node: Node) {
        const mode = this.options.mode;

        if (mode === 'textSize') {
            const text = node.textBetween(0, node.content.size, undefined, ' ')

            return text.length
        }

        return node.nodeSize
    }

    words(node: Node) {
        const text: string = node.textBetween(0, node.content.size, ' ', ' ')
        const words = text.split(' ').filter(word => word !== '')

        return words.length
    }

}

export function characterCount(options: CharacterCountOptions, editor: any) {

    const plugin = new CharacterCountPlugin(options);

    return new Plugin({
        key: new PluginKey('characterCount'),
        filterTransaction: (transaction, state) => {
            const limit = plugin.options.limit

            // Nothing has changed or no limit is defined. Ignore it.
            if (!transaction.docChanged || limit === 0 || limit === null || limit === undefined) {
                return true
            }

            const oldSize = plugin.characters(state.doc)
            const newSize = plugin.characters(transaction.doc)

            // Everything is in the limit. Good.
            if (newSize <= limit) {
                return true
            }

            // The limit has already been exceeded but will be reduced.
            if (oldSize > limit && newSize > limit && newSize <= oldSize) {
                return true
            }

            // The limit has already been exceeded and will be increased further.
            if (oldSize > limit && newSize > limit && newSize > oldSize) {
                return false
            }

            const isPaste = transaction.getMeta('paste')

            // Block all exceeding transactions that were not pasted.
            if (!isPaste) {
                return false
            }

            // For pasted content, we try to remove the exceeding content.
            const pos = transaction.selection.$head.pos
            const over = newSize - limit
            const from = pos - over
            const to = pos

            // It’s probably a bad idea to mutate transactions within `filterTransaction`
            // but for now this is working fine.
            transaction.deleteRange(from, to)

            // In some situations, the limit will continue to be exceeded after trimming.
            // This happens e.g. when truncating within a complex node (e.g. table)
            // and ProseMirror has to close this node again.
            // If this is the case, we prevent the transaction completely.
            const updatedSize = plugin.characters(transaction.doc)

            return updatedSize <= limit;
        },
        state: {
            /**
             * Initialize the plugin's internal state.
             *
             * @returns {Object}
             */
            init() {
                return plugin.initStorage();
            },

            /**
             * Apply changes to the plugin state from a view transaction.
             *
             * @param {Transaction} tr
             * @param {Object} prev
             *
             * @returns {Object}
             */
            apply(tr, prev) {
                const {selection} = tr;
                const node = tr.doc;

                const next =
                    {...prev, characters: plugin.characters(node), words: plugin.words(node)};

                return next;
            },
        },
    });
}
