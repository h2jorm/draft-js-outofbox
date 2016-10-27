import React, {PropTypes} from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';

import StyleControls from './StyleControls';

const RichEditor = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    defaultHTML: PropTypes.string,
  },

  getInitialState() {
    const {defaultHTML = ''} = this.props;
    return {
      editorState: EditorState.createWithContent(
        stateFromHTML(defaultHTML)
      ),
    };
  },

  focus() {
    this.refs.editor.focus();
  },

  handleChange(editorState) {
    this.setState({editorState});
    this.props.onChange(stateToHTML(editorState.getCurrentContent()));
  },

  toggleBlockType(blockType) {
    this.handleChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  },

  toggleInlineStyle(inlineStyle) {
    this.handleChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  },

  renderToolbar() {
    const {editorState} = this.state;
    return (
      <div className="richeditor-toolbar">
        <StyleControls.Block
          editorState={editorState}
          onToggle={this.toggleBlockType}
        />
        <StyleControls.Inline
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
      </div>
    );
  },

  render() {
    const {editorState} = this.state;
    return (
      <div
        className="richeditor-container ant-input"
        ref="editorContainer"
        onClick={() => this.focus()}
      >
        {
          this.renderToolbar()
        }
        <Editor
          ref="editor"
          editorState={editorState}
          onChange={this.handleChange}
        />
      </div>
    );
  }
});

export default RichEditor;
