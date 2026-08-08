
export type UploadResult = {
    status: "success" | "error" | "failed";

    department?: string;
    filename?: string;

    error_type?: string;
    message?: string;

    expected?: string | string[];
    details?: string[];

    ai_summary?: {
        title?: string;
        message?: string;
        detected_text?: string;
    };

    cortex_content?: {
        content?: string;

        metadata?: {
            pageCount?: number;
            [key: string]: unknown;
        };

        [key: string]: unknown;
    };

    database_result?: {
        status?: string;
        inserted_rows?: number;
        skipped_duplicates?: number;
        total_processed?: number;
        message?: string;
        error?: string;
    };
};

export type UploadModalProps = {
    open: boolean;
    onClose: () => void;
};

export type FeedbackModalProps = {
    open: boolean;
    onClose: () => void;
    result: UploadResult | null;
};
