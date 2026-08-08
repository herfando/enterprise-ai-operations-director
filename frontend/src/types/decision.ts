
export type DecisionData = {
    title?: string;
    severity?: string;
    priority?: string;
    confidence?: number | string;

    executive_summary?: string;
    primary_problem?: string;
    why_first?: string;

    evidence?: string[];

    business_impact?: string;

    immediate_actions?: string[];
    follow_up_actions?: string[];

    recommendation?: string;
    expected_impact?: string;

    // Untuk kompatibilitas dengan format lama
    estimated_loss?: string;
    problem?: string;
    actions?: string[];
    reasoning?: string;

    [key: string]: unknown;
};

export type DecisionResponse = {
    status: string;
    department?: string;
    start_date?: string;
    end_date?: string;

    // Cortex saat ini mengembalikan JSON sebagai STRING
    decision?: DecisionData | string;
};

