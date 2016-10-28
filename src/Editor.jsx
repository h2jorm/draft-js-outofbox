import React, {PropTypes} from 'react';
import {
  AtomicBlockUtils,
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
    console.log(entityMap.toArray().map(a => a.toObject()));
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
    this.setState({editorState}, () => {
      setTimeout(this.focus, 0);
    });
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
        {
          this.renderInsertImgBtn()
        }
        {
          this.renderInsertLinkBtn()
        }
      </div>
    );
  },

  handleImgInsert() {
    const {editorState} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'IMAGE',
      'MUTABLE',
      {
        src: 'http://images.dtcj.com/DTCJ/6333c9fa9f073683d1d3853f2862d31cbb3925c8d863c4f1d33eedba5197118a.jpg',
        height: '100px',
      },
    );

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.handleChange(AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      ' ',
    ));
  },

  handleLinkInsert() {
    const {editorState} = this.state;
    const withLink = RichUtils.currentBlockContainsLink(editorState);
    if (withLink)
      this.removeLink();
    else
      this.addLink();
  },

  addLink() {
    const {editorState} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url: 'http://www.google.com'}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    this.handleChange(RichUtils.toggleLink(
      newEditorState,
      newEditorState.getSelection(),
      entityKey,
    ));
  },

  removeLink() {
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.handleChange(
        RichUtils.toggleLink(editorState, selection, null),
      );
    }
  },

  renderInsertImgBtn() {
    return (
      <span onClick={this.handleImgInsert}>插入图片</span>
    );
  },

  renderInsertLinkBtn() {
    return (
      <span onClick={this.handleLinkInsert}>插入链接</span>
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
