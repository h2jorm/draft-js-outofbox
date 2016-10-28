import React, {PropTypes} from 'react';
import {
  ContentState,
  Editor,
  EditorState,
  DraftEntityInstance,
  RichUtils,
  convertFromHTML,
} from '../Draft/Draft';
import decorator from './decorator';
// import blockRenderMap from './blockRenderMap';
// import blockRenderer from './blockRenderer';

import StyleControls from './StyleControls';

const RichEditor = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    defaultHTML: PropTypes.string,
  },

  getInitialState() {
    const {defaultHTML = ''} = this.props;
    let {contentBlocks, entityMap} = convertFromHTML(
      defaultHTML,
    );
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    );
    return {
      editorState: EditorState.createWithContent(
        contentState,
        decorator,
      ),
    };
  },

  focus() {
    this.refs.editor.focus();
  },

  handleChange(editorState) {
    this.setState({editorState});
    // this.props.onChange(stateToHTML(editorState.getCurrentContent()));
  },

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
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
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.handleChange}
        />
      </div>
    );
  }
});

export default RichEditor;
