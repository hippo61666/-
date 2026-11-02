import React, { useRef, useState } from 'react';
import FileThumbnail from './FileThumbnail';

function UploadIcon({ name }) {
  return <img className="icon" src={`/assets/${name}.png`} width={16} height={16} alt="" draggable="false" />;
}

function formatSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export default function ExtractionUploadCard({ request, sourceFiles, onFiles, onWork, onRemove, onRemoveAll, onReorder, onSubmit }) {
  const filePicker = useRef(null);
  const folderPicker = useRef(null);
  const [showWorkInput, setShowWorkInput] = useState(false);
  const [workLink, setWorkLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const draggedFile = useRef(null);
  const [dropTarget, setDropTarget] = useState(null);
  const submitted = request.submitted;
  const hasFiles = request.files.length > 0;

  function selectFiles(event) {
    onFiles(request.id, Array.from(event.target.files ?? []));
    event.target.value = '';
  }

  function addWork(event) {
    event.preventDefault();
    const urlText = workLink.match(/https?:\/\/[^\s]+/)?.[0];
    let url;
    try { url = new URL(urlText); } catch { /* Validated below. */ }
    if (!url || url.protocol !== 'https:' || !/(^|\.)douyin\.com$|(^|\.)iesdouyin\.com$/i.test(url.hostname)) {
      setLinkError('请粘贴有效的抖音作品链接');
      return;
    }
    onWork(request.id, url.href);
    setWorkLink('');
    setLinkError('');
    setShowWorkInput(false);
  }

  return (
    <div
      className={`extraction-upload-card ${hasFiles ? 'has-files' : ''} ${dragging ? 'is-dragging' : ''}`}
      role="group"
      aria-label="上传提炼文件"
      onDragEnter={event => {
        if (submitted || !event.dataTransfer.types.includes('Files')) return;
        event.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={event => {
        if (!submitted && event.dataTransfer.types.includes('Files')) {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (!dragDepth.current) setDragging(false);
      }}
      onDrop={event => {
        if (submitted) return;
        event.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        onFiles(request.id, Array.from(event.dataTransfer.files));
      }}
    >
      <div className="extraction-upload-header">
        <h3>上传文件</h3>
        <ul>
          <li>支持上传剧集正片、原著全文、剧本台本、角色小传、设定集等内容</li>
          <li>上传角色正脸、全身、侧身等形象图，可提升解析准确度</li>
          <li>多个文件请按剧集顺序上传，便于依次提炼</li>
        </ul>
      </div>
      <div className="extraction-upload-options">
        <button type="button" disabled={submitted} onClick={() => filePicker.current?.click()}><UploadIcon name="upload-file" />本地文件</button>
        <button type="button" disabled={submitted} onClick={() => folderPicker.current?.click()}><UploadIcon name="upload-folder" />本地文件夹</button>
        <button type="button" disabled={submitted} onClick={() => { setShowWorkInput(!showWorkInput); setLinkError(''); }}><UploadIcon name="upload-douyin" />抖音作品</button>
      </div>
      <input ref={filePicker} type="file" multiple className="visually-hidden" aria-label="选择要提炼的本地文件" tabIndex={-1} onChange={selectFiles} />
      <input ref={folderPicker} type="file" multiple webkitdirectory="" directory="" className="visually-hidden" aria-label="选择要提炼的本地文件夹" tabIndex={-1} onChange={selectFiles} />
      {showWorkInput && !submitted && <form className="extraction-work-form" onSubmit={addWork}>
        <label>抖音作品链接<input autoFocus type="text" value={workLink} onChange={event => { setWorkLink(event.target.value); setLinkError(''); }} placeholder="粘贴作品链接或分享文案" aria-invalid={Boolean(linkError)} aria-describedby={linkError ? `work-error-${request.id}` : undefined} /></label>
        {linkError && <p className="extraction-link-error" id={`work-error-${request.id}`} role="alert">{linkError}</p>}
        <div><button type="button" className="secondary-button" onClick={() => setShowWorkInput(false)}>取消</button><button type="submit" className="primary-button" disabled={!workLink.trim()}>添加作品</button></div>
      </form>}
      {hasFiles && <>
        <div className="extraction-file-list" aria-label="已收集的提炼资料">
        <span className="visually-hidden" role="status">已添加 {request.files.length} 份资料，可拖动排序</span>
        <ol>
          {request.files.map((file, index) => <li
            key={file.id}
            className={dropTarget === file.id ? 'is-drop-target' : ''}
            onDragOver={event => {
              if (submitted || !draggedFile.current) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
              setDropTarget(file.id);
            }}
            onDrop={event => {
              if (submitted || !draggedFile.current) return;
              event.preventDefault();
              event.stopPropagation();
              const sourceIndex = request.files.findIndex(item => item.id === draggedFile.current);
              if (sourceIndex !== index) onReorder(request.id, draggedFile.current, index - sourceIndex);
              draggedFile.current = null;
              setDropTarget(null);
            }}
          >
            <button
              type="button"
              className="extraction-drag-handle"
              aria-label={`调整 ${file.name} 顺序，当前第 ${index + 1} 项`}
              title="拖动排序，或按上下方向键调整"
              disabled={submitted}
              draggable={!submitted}
              onDragStart={event => {
                draggedFile.current = file.id;
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('application/x-star-file', file.id);
              }}
              onDragEnd={() => { draggedFile.current = null; setDropTarget(null); }}
              onKeyDown={event => {
                if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                  event.preventDefault();
                  onReorder(request.id, file.id, event.key === 'ArrowUp' ? -1 : 1);
                }
              }}
            ><img src="/assets/file-drag-handle.png" alt="" draggable="false" /></button>
            <FileThumbnail file={file} sourceFile={sourceFiles?.get(file.id)} />
            <div className="extraction-file-info"><strong title={file.path || file.name}>{file.name}</strong><small>{file.source === 'douyin' ? '抖音作品' : formatSize(file.size)}</small></div>
            {!submitted && <div className="extraction-file-actions">
              <button type="button" aria-label={`上移 ${file.name}`} title="上移" disabled={index === 0} onClick={() => onReorder(request.id, file.id, -1)}>↑</button>
              <button type="button" aria-label={`下移 ${file.name}`} title="下移" disabled={index === request.files.length - 1} onClick={() => onReorder(request.id, file.id, 1)}>↓</button>
              <button type="button" aria-label={`移除 ${file.name}`} title="移除" onClick={() => onRemove(request.id, file.id)}>×</button>
            </div>}
          </li>)}
        </ol>
        </div>
        <div className="extraction-card-footer">
          <button type="button" className="extraction-clear" disabled={submitted} onClick={() => onRemoveAll(request.id)}>全部删除</button>
          <button type="button" className="primary-button extraction-confirm" disabled={submitted} onClick={() => onSubmit(request.id)}>确认<img src="/assets/confirm-enter.png" width={14} height={14} alt="" /></button>
        </div>
      </>}
      {dragging && <div className="extraction-drop-hint">松开以添加文件</div>}
    </div>
  );
}
