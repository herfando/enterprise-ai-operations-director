
export type UploadResult = {
    status: "success" | "error" | "failed";

    department?: string;
    filename?: string;

    error_type?: string;
    message?: string;

    expected?: string | string[];
    details?: string[];

    database_result?: {
        status?: string;
        inserted_rows?: number;
        skipped_duplicates?: number;
        total_processed?: number;
        message?: string;
        error?: string;
    };
};
