import { useState } from 'react';
import uploadProducts from './uploadProducts';

export default function AdminUpload() {
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [log, setLog] = useState('');

    const handleUpload = async () => {
        setStatus('uploading');
        setLog('Starting upload...');
        try {
            // Override console.log to capture output
            const originalLog = console.log;
            console.log = (...args) => {
                setLog(prev => prev + '\n' + args.join(' '));
                originalLog(...args);
            };

            await uploadProducts();

            console.log = originalLog;
            setStatus('success');
            setLog(prev => prev + '\nUpload complete!');
        } catch (error) {
            setStatus('error');
            setLog(prev => prev + '\nError: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 text-primary dark:text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6">Database Management</h1>

                <div className="mb-8">
                    <p className="text-sm text-neutral-500 mb-4">
                        Upload initial product data to Firestore. This will overwrite existing products with matching IDs.
                    </p>

                    <button
                        onClick={handleUpload}
                        disabled={status === 'uploading'}
                        className={`w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-all
                            ${status === 'uploading'
                                ? 'bg-neutral-200 text-neutral-500 cursor-wait'
                                : 'bg-primary text-white hover:bg-neutral-800 dark:bg-white dark:text-primary dark:hover:bg-neutral-200'}
                        `}
                    >
                        {status === 'uploading' ? 'Uploading...' : 'Seed Database'}
                    </button>
                </div>

                {log && (
                    <div className="bg-neutral-950 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-60 whitespace-pre-wrap">
                        {log}
                    </div>
                )}

                {status === 'success' && (
                    <div className="mt-4 text-green-600 font-bold text-center">
                        Success! Database populated.
                    </div>
                )}
            </div>
        </div>
    );
}
