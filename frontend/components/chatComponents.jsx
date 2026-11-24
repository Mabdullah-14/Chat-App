import React, { useRef, useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Smile, Paperclip, FileText, X } from 'lucide-react';
import { useChat } from '../src/hooks/useChat';
import { useAuth } from '../Context/authContext';

const FILE_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MAX_SIZE = 3 * 1024 * 1024; // 3 MB

export default function ChatComponent({ receiverId }) {
    const { user } = useAuth();
    const { message, setMessage, chatLog, loading, sendMessage, uploading, error, socketError, resendMessage } = useChat(receiverId);

    const [showEmoji, setShowEmoji] = useState(false);
    const [sizeError, setSizeError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [isResending, setIsResending] = useState(false)

    const bottomRef = useRef(null);
    const fileRef = useRef(null);

    const myId = String(user?.id || user?._id);

    //  Memory Leak Fix: Image preview URL generation with proper cleanup
    useEffect(() => {
        if (!selectedFile || !selectedFile.type.startsWith('image/')) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        // Cleanup: Purana URL browser ki memory se delete karne ke liye
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    // Chat auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatLog]);

    // Receiver change ho to purani selected file saaf kar dein
    useEffect(() => {
        setSelectedFile(null);
        setSizeError('');
    }, [receiverId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploading) return;
        setShowEmoji(false);

        const ok = await sendMessage(selectedFile);
        if (ok) setSelectedFile(null);
    };

    const handleResendClick = async () => {
        setIsResending(true)
        await resendMessage()
        setIsResending(false)
    }

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > MAX_SIZE) {
            setSizeError('File must be less than 3MB.');
            e.target.value = '';
            return;
        }

        setSizeError('');
        setSelectedFile(file);
        e.target.value = ''; // Same file will be select again
    };

    const canSend = !uploading && (message.trim() !== '' || selectedFile !== null);

    return (
        <div className="flex h-full w-full flex-col bg-slate-50">
            {/* Messages Body */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        Loading history...
                    </div>
                ) : chatLog.length > 0 ? (
                    chatLog.map((msg, index) => {
                        const isMe = String(msg.senderId) === myId;
                        const fileLink = msg.fileUrl ? `${FILE_BASE}${msg.fileUrl}` : null;

                        return (
                            <div key={msg.id || index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl p-3 text-sm shadow-sm ${isMe ? 'rounded-tr-none bg-teal-600 text-white' : 'rounded-tl-none border border-slate-100 bg-white text-slate-800'
                                    }`}>
                                    {/* Image File Display */}
                                    {fileLink && msg.fileType?.startsWith('image/') && (
                                        <a href={fileLink} target="_blank" rel="noreferrer">
                                            <img src={fileLink} alt={msg.fileName || 'image'} className="mb-2 max-h-64 rounded-lg object-contain" />
                                        </a>
                                    )}

                                    {/* Document File Display */}
                                    {fileLink && !msg.fileType?.startsWith('image/') && (
                                        <a href={fileLink} target="_blank" rel="noreferrer" className="mb-2 flex items-center gap-2 underline">
                                            <FileText className="h-4 w-4 shrink-0" />
                                            <span className="break-all">{msg.fileName || 'File'}</span>
                                        </a>
                                    )}

                                    {msg.text && <p className="break-words leading-relaxed">{msg.text}</p>}

                                    <span className="mt-1 block text-right text-[9px] text-slate-400">
                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        No messages yet. Send a text to start the conversation!
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Unified Error Alert Box with Anti-Resend Loader */}
            {(error || sizeError || socketError) && (
                <div className="mx-auto mb-2 flex w-full max-w-4xl items-center justify-between rounded-lg bg-red-50 p-3 border border-red-200 shadow-sm">
                    <p className="text-xs text-red-500 font-medium">
                        {sizeError || error || (socketError && "⚠️ Message delivery failed. Socket or network issue detected.")}
                    </p>
                    {socketError && (
                        <button
                            type="button"
                            disabled={isResending}
                            onClick={handleResendClick}
                            className="text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold px-3 py-1.5 rounded-md transition-colors shrink-0 shadow-sm"
                        >
                            {isResending ? "Resending..." : "Resend Message"}
                        </button>
                    )}
                </div>
            )}

            {/* Input Footer */}
            <div className="relative border-t border-slate-200 bg-white p-4">
                {showEmoji && (
                    <div className="absolute bottom-full left-4 z-10">
                        <EmojiPicker onEmojiClick={(e) => setMessage((m) => m + e.emoji)} height={380} />
                    </div>
                )}

                {/* Selected file preview */}
                {selectedFile && (
                    <div className="mx-auto mb-2 flex max-w-4xl items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                        {previewUrl ? (
                            <img src={previewUrl} alt="preview" className="h-12 w-12 rounded object-cover" />
                        ) : (
                            <FileText className="h-6 w-6 shrink-0 text-slate-500" />
                        )}
                        <span className="flex-1 truncate text-xs text-slate-700">{selectedFile.name}</span>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFile(null);
                                if (fileRef.current) fileRef.current.value = "";
                            }}
                            disabled={uploading}
                            aria-label="Remove file"
                            className="rounded p-1 text-slate-400 hover:text-red-500 disabled:opacity-50"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl items-center gap-2">
                    <button type="button" onClick={() => setShowEmoji((s) => !s)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                        <Smile className="h-5 w-5" />
                    </button>

                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50">
                        <Paperclip className="h-5 w-5" />
                    </button>

                    <input ref={fileRef} type="file" hidden accept="image/*,.pdf,.docx,.txt,.zip" onChange={handleFile} />

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={uploading}
                        placeholder={uploading ? 'Uploading attachment...' : 'Type a message...'}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none disabled:opacity-70"
                    />

                    <button
                        type="submit"
                        disabled={!canSend || uploading}
                        className="flex h-11 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white disabled:opacity-50 min-w-[80px]"
                    >
                        {uploading ? (
                            <div className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"></span>
                                <span>Sending...</span>
                            </div>
                        ) : (
                            'Send'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );

}
