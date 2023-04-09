import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { exampleSetup } from "prosemirror-example-setup";
import { schema as basicSchema } from "prosemirror-schema-basic";
import {characterCount} from "../../src/plugin";

declare global {
    interface Window {
        view: EditorView;
    }
}

const schema = new Schema({
    nodes: basicSchema.spec.nodes,
    marks: basicSchema.spec.marks
});

const plugins = exampleSetup({ schema: schema });
plugins.push(characterCount({limit: 100, mode: "textSize"}, null));

window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
        doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
        plugins: plugins
    })
});
