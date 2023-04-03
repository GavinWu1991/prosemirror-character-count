import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { exampleSetup } from "prosemirror-example-setup";
import { schema as basicSchema } from "prosemirror-schema-basic";

var schema = new Schema({
    nodes: basicSchema.spec.nodes,
    marks: basicSchema.spec.marks
});

var plugins = exampleSetup({ schema: schema });

window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create({
        doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
        plugins: plugins
    })
});
