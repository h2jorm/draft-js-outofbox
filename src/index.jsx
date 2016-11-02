import React, {PropTypes} from 'react';
import {stateToHTML} from './DraftJsExportHtml/main';
import {
  AtomicBlockUtils,
  ContentState,
  Editor,
  EditorState,
  DraftEntityInstance,
  RichUtils,
  convertFromHTML,
} from './Draft/Draft';
import * as Icons from './Icons';
import decorator from './decorator';

import StyleControls from './StyleControls';

const DraftJsOutOfBox = React.createClass({
  propTypes: {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    config: PropTypes.object.isRequired,
  },

  defaultProps: {
    value: '',
    config: {
      style: [],
      plugins: {},
    },
    onChange: () => {},
  },

  getInitialState() {
    return {
      editorState: this.htmlToEditorState(this.props.value),
    };
  },

  componentWillReceiveProps(nextProps) {
    // prevent editor from re-rendering
    if (nextProps.value === this.lastRecord) {
      return;
    }
    this.handleChange(this.htmlToEditorState(nextProps.value));
  },

  // component update only in two cases
  shouldComponentUpdate(nextProps, nextState) {
    // case1: when initializing editor especially if loading remote data
    if (nextProps.value !== this.lastRecord) {
      return true;
    }
    // case2: update editorState
    if (nextState.editorState !== this.state.editorState) {
      return true;
    }
    // otherwise: prevent from updating
    return false;
  },

  htmlToEditorState(html) {
    let {contentBlocks, entityMap} = convertFromHTML(
      html || '',
    );
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap,
    );
    return EditorState.createWithContent(
      contentState,
      decorator,
    );
  },

  focus() {
    this.refs.editor.focus();
  },

  handleChange(editorState) {
    this.setState({editorState});
    // prevent editor from re-rendering
    this.lastRecord = stateToHTML(editorState.getCurrentContent());
    this.props.onChange(this.lastRecord);
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
      <div className="draft-js-outofbox-toolbar">
        <StyleControls.Block
          editorState={editorState}
          onToggle={this.toggleBlockType}
          require={style}
        />
        <StyleControls.Inline
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
          require={style}
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

  getMaybeHref() {
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      return null;
    }
    const contentState = editorState.getCurrentContent();
    const startKey = selection.getStartKey();
    const startOffset = selection.getStartOffset();
    const block = contentState.getBlockForKey(startKey);
    // if there is only text, entityKey will be `null`
    const entityKey = block.getEntityAt(startOffset);
    let url = null;
    if (entityKey) {
      const entity = contentState.getEntity(entityKey);
      const entityData = entity.getData();
      url = entityData && entityData.url || null;
    }
    return url;
  },

  handleLinkToggle(before) {
    const that = this;
    const maybeHref = this.getMaybeHref();
    if (typeof before === 'function') {
      before(maybeHref);
    }
    return function after(link) {
      that.focus();
      // wait focus
      setTimeout(() => {
        if (!link) {
          that.removeLink();
        } else {
          that.addLink(link);
        }
      }, 0);
    };
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
      <span className="draft-js-outofbox-toolicon" onClick={() => plugins.imgUpload(this.handleImgInsert)}>
        <Icons.Image />
      </span>
    );
  },

  renderInsertLinkBtn() {
    const {config: {plugins}} = this.props;
    return (
      <span
        className="draft-js-outofbox-toolicon"
        onClick={() => plugins.toggleLink(this.handleLinkToggle)}
      >
        <Icons.Link />
      </span>
    );
  },

  render() {
    const {editorState} = this.state;
    return (
      <div
        className="draft-js-outofbox"
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

export default DraftJsOutOfBox;
