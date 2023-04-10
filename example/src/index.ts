import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {DOMParser, Schema} from "prosemirror-model";
import {exampleSetup} from "prosemirror-example-setup";
import {schema as basicSchema} from "prosemirror-schema-basic";
import {characterCountPlugin} from "../../src";

declare global {
    interface Window {
        view: EditorView;
    }
}

const schema = new Schema({
    nodes: basicSchema.spec.nodes,
    marks: basicSchema.spec.marks
});

const plugins = exampleSetup({schema: schema});
plugins.push(characterCountPlugin({limit: 100, mode: "textSize"}));

window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
        doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
        plugins: plugins
    })
});
