import React, { useEffect, useRef, useState } from 'react';

export default function FileThumbnail({ file, sourceFile }) {
  const [url, setUrl] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const dialog = useRef(null);
  const isVideo = Boolean(sourceFile && (file.type?.startsWith('video/') || /\.(mp4|mov|webm|m4v)$/i.test(file.name)));
  const isImage = Boolean(sourceFile && (file.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|avif)$/i.test(file.name)));
  const canPreview = isVideo || isImage;

  useEffect(() => {
    if (!sourceFile || !canPreview) return;
    const objectUrl = URL.createObjectURL(sourceFile);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [sourceFile, canPreview]);

  useEffect(() => {
    if (previewOpen) dialog.current?.showModal();
  }, [previewOpen]);

  return <>
    <button type="button" className={`extraction-thumbnail ${canPreview ? 'has-preview' : ''}`} disabled={!canPreview || !url} aria-label={`预览 ${file.name}`} onClick={() => setPreviewOpen(true)}>
      {url && isImage ? <img src={url} alt={file.name} draggable="false" /> :
        url && isVideo ? <><video src={url} muted playsInline preload="metadata" onLoadedMetadata={event => { const video = event.currentTarget; if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = Math.min(.1, video.duration / 2); }} /><span className="extraction-video-play" aria-hidden="true" /></> :
          <img className="extraction-type-icon" src={`/assets/${file.source === 'douyin' ? 'upload-douyin' : 'file'}.png`} alt="" draggable="false" />}
    </button>
    {previewOpen && <dialog ref={dialog} className="file-preview-dialog" onClose={() => setPreviewOpen(false)}>
      <div className="file-preview-header"><strong>{file.name}</strong><button type="button" className="plain-button" aria-label="关闭文件预览" onClick={() => dialog.current?.close()}>×</button></div>
      {isVideo ? <video src={url} controls playsInline autoPlay /> : <img src={url} alt={file.name} />}
    </dialog>}
  </>;
}
