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
    config: PropTypes.object.isRequired,
  },

  defaultProps: {
    config: {
      style: [],
      plugins: {},
    },
    onChange: () => {},
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
    const {config: {style, plugins}} = this.props;
    return (
      <div className="richeditor-toolbar">
        <StyleControls.Block
          editorState={editorState}
          onToggle={this.toggleBlockType}
          require={['h1', 'h2', 'h3', 'quote', 'ul', 'ol']}
        />
        <StyleControls.Inline
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
          require={['i', 'u']}
        />
        {
          plugins.imgUpload ?
          this.renderInsertImgBtn() : null
        }
        {
          plugins.toggleLink ?
          this.renderInsertLinkBtn() : null
        }
      </div>
    );
  },

  handleImgInsert(src) {
    const {editorState} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'IMAGE',
      'MUTABLE',
      {
        src,
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

  handleLinkToggle(...args) {
    const {editorState} = this.state;
    const withLink = RichUtils.currentBlockContainsLink(editorState);
    console.log(withLink);
    if (withLink)
      this.removeLink();
    else
      this.addLink(...args);
  },

  addLink(url) {
    const {editorState} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {url}
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
    const {config: {plugins}} = this.props;
    return (
      <span onClick={() => plugins.imgUpload(this.handleImgInsert)}>
        insert image
      </span>
    );
  },

  renderInsertLinkBtn() {
    const {config: {plugins}} = this.props;
    return (
      <span onClick={() => plugins.toggleLink(this.handleLinkToggle)}>
        insert link
      </span>
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
