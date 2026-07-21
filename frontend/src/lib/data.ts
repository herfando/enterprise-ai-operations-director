export type KPI = {
    label: string;
    value: string;
};

export type Department = {
    id: number;
    name: string;
    status: string;
    risk: string;
    kpis: KPI[];
    analysis: any;
}




// =====================================================
// COMPANY HEALTH
// =====================================================

export const companyHealth = {
    score: 87,

    productionEfficiency: 91,
    qualityRate: 96,
    onTimeDelivery: 94,
    machineAvailability: 89,

    totalRisk: 3,
    aiDecisionsToday: 12,
};


// =====================================================
// DEPARTMENT INTELLIGENCE
// =====================================================

export const departments: Department[] = [

    // =====================================================
    // SALES & MARKETING
    // =====================================================

    {
        id: 1,
        name: "Sales & Marketing",
        status: "Healthy",
        risk: "Low",

        kpis: [
            { label: "revenueGrowth", value: "12%" },
            { label: "orderFulfillment", value: "96%" },
            { label: "customerSatisfaction", value: "94%" },
        ],

        analysis: {

            metrics: [
                {
                    name: "Monthly Sales",
                    value: "$2.4M"
                },
                {
                    name: "Customer Orders",
                    value: "1,240"
                },
                {
                    name: "Forecast Accuracy",
                    value: "92%"
                }
            ],

            issues: [
                "High demand from automotive segment"
            ],

            rootCause: [
                "Seasonal customer demand increase"
            ],

            recommendation: [
                "Increase production capacity planning",
                "Review material availability"
            ],

            timeline: [
                "08:00 Customer demand updated",
                "09:00 AI demand forecast completed"
            ]
        }
    },


    // =====================================================
    // PRODUCTION
    // =====================================================

    {
        id: 2,
        name: "Production",
        status: "Critical",
        risk: "High",

        kpis: [
            { label: "oee", value: "62%" },
            { label: "availability", value: "75%" },
            { label: "performance", value: "83%" },
            { label: "quality", value: "92%" },
            { label: "rejectRate", value: "5.2%" },
            { label: "downtime", value: "150 min" },
        ],


        analysis: {


            machines: [

                {
                    name: "Injection Machine 01",
                    status: "Running",
                    downtime: "15 min",
                    reason: "Material Loading"
                },

                {
                    name: "Injection Machine 02",
                    status: "Stopped",
                    downtime: "85 min",
                    reason: "Cooling System Failure"
                },

                {
                    name: "Injection Machine 03",
                    status: "Warning",
                    downtime: "40 min",
                    reason: "Temperature Fluctuation"
                },

                {
                    name: "Thermoforming Machine 01",
                    status: "Running",
                    downtime: "10 min",
                    reason: "Changeover"
                }

            ],


            downtimeAnalysis: [

                {
                    problem: "Cooling System",
                    duration: "85 min",
                    machine: "Injection Machine 02",
                    impact: "700 pcs loss"
                },

                {
                    problem: "Temperature Control",
                    duration: "40 min",
                    machine: "Injection Machine 03",
                    impact: "Reject increase"
                },

                {
                    problem: "Material Change",
                    duration: "25 min",
                    machine: "Injection Machine 01",
                    impact: "Production delay"
                }

            ],


            issues: [

                "OEE below target 85%",
                "Cooling instability detected",
                "Reject trend increasing"

            ],


            rootCause: [

                "Cooling temperature unstable",
                "Preventive maintenance overdue",
                "Machine parameter variation"

            ],


            recommendation: [

                "Inspect cooling pump",
                "Check temperature sensor",
                "Perform QC verification",
                "Schedule preventive maintenance"

            ],


            timeline: [

                "08:00 Machine #02 running",
                "09:15 Cooling alarm detected",
                "09:30 Reject increased",
                "10:00 AI anomaly detection triggered"

            ]

        }

    },


    // =====================================================
    // PPIC
    // =====================================================

    {
        id: 3,
        name: "PPIC",
        status: "Warning",
        risk: "Medium",

        kpis: [
            { label: "scheduleAdherence", value: "88%" },
            { label: "capacityUtilization", value: "81%" },
            { label: "deliveryRisk", value: "Medium" },
        ],

        analysis: {

            issues: [
                "Production schedule risk detected",
                "Capacity imbalance"
            ],

            rootCause: [
                "Machine downtime affecting plan"
            ],

            recommendation: [
                "Adjust production sequence",
                "Prioritize urgent customer orders"
            ],

            timeline: [
                "08:30 Delivery risk detected"
            ]

        }

    },


    // =====================================================
    // QCQA
    // =====================================================

    {
        id: 4,
        name: "QCQA",
        status: "Critical",
        risk: "High",

        kpis: [
            { label: "rejectRate", value: "5.2%" },
            { label: "defectTrend", value: "Increasing" },
            { label: "capaCompletion", value: "76%" },
        ],


        analysis: {


            defects: [

                {
                    defect: "Short Shot",
                    qty: "210 pcs",
                    machine: "Injection #02"
                },

                {
                    defect: "Burn Mark",
                    qty: "180 pcs",
                    machine: "Injection #03"
                },

                {
                    defect: "Dimension Error",
                    qty: "130 pcs",
                    machine: "Injection #01"
                }

            ],


            issues: [
                "Reject rate above target"
            ],

            rootCause: [
                "Cooling instability",
                "Process parameter variation"
            ],

            recommendation: [
                "Perform CAPA",
                "Verify first article production"
            ]

        }

    },


    // =====================================================
    // MAINTENANCE
    // =====================================================

    {
        id: 5,
        name: "Maintenance",
        status: "Warning",
        risk: "Medium",

        kpis: [
            { label: "mtbf", value: "180 hrs" },
            { label: "mttr", value: "28 min" },
            { label: "pmCompliance", value: "84%" },
        ],

        analysis: {

            machines: [

                {
                    name: "Injection Machine 02",
                    condition: "Critical",
                    issue: "Cooling Pump"
                },

                {
                    name: "Injection Machine 03",
                    condition: "Warning",
                    issue: "Temperature Sensor"
                }

            ],

            issues: [
                "Preventive maintenance overdue"
            ],

            rootCause: [
                "PM schedule delay"
            ],

            recommendation: [
                "Execute preventive maintenance"
            ]

        }

    },


    // =====================================================
    // WAREHOUSE
    // =====================================================

    {
        id: 6,
        name: "Warehouse",
        status: "Healthy",
        risk: "Low",

        kpis: [
            { label: "inventoryAccuracy", value: "99%" },
            { label: "stockAvailability", value: "96%" },
            { label: "stockRisk", value: "Low" },
        ],

        analysis: {

            issues: [
                "No critical inventory risk"
            ],

            recommendation: [
                "Maintain current stock policy"
            ]

        }

    },


    // =====================================================
    // PURCHASING
    // =====================================================

    {
        id: 7,
        name: "Purchasing",
        status: "Healthy",
        risk: "Low",

        kpis: [
            { label: "supplierOnTime", value: "95%" },
            { label: "leadTime", value: "7 days" },
            { label: "supplierRisk", value: "Low" },
        ],

        analysis: {

            issues: [
                "Supplier performance stable"
            ],

            recommendation: [
                "Continue supplier monitoring"
            ]

        }

    },


    // =====================================================
    // FINANCE
    // =====================================================

    {
        id: 8,
        name: "Finance",
        status: "Healthy",
        risk: "Low",

        kpis: [
            { label: "operatingCost", value: "$185K" },
            { label: "budgetVariance", value: "2%" },
            { label: "profitability", value: "18%" },
        ],

        analysis: {

            issues: [
                "Production loss impact monitored"
            ],

            recommendation: [
                "Track operational cost reduction"
            ]

        }

    },


    // =====================================================
    // SAFETY
    // =====================================================

    {
        id: 9,
        name: "Safety (K3)",
        status: "Healthy",
        risk: "Low",

        kpis: [
            { label: "incidents", value: "0" },
            { label: "nearMiss", value: "2" },
            { label: "compliance", value: "99%" },
        ],

        analysis: {

            issues: [
                "No major safety incident"
            ],

            recommendation: [
                "Continue safety audit"
            ]

        }

    },


    // =====================================================
    // R&D
    // =====================================================

    {
        id: 10,
        name: "Research & Development",
        status: "Healthy",
        risk: "Low",

        kpis: [
            { label: "activeProjects", value: "5" },
            { label: "improvements", value: "12" },
            { label: "innovationScore", value: "91%" },
        ],

        analysis: {

            issues: [
                "Optimization opportunity detected"
            ],

            recommendation: [
                "Evaluate process improvement project"
            ]

        }

    }

];


// =====================================================
// AI DECISION
// =====================================================

export const aiDecision = {

    title: "Production Reject Increase",

    severity: "Critical",

    confidence: 94,

    businessImpact: "High",

    estimatedLoss: "$5,200",

    recommendation:
        "Schedule immediate maintenance, inspect cooling system, verify material batch, and perform QC verification."

};


// =====================================================
// WORKFLOWS
// =====================================================

export const workflows = [

    {
        title: "Corrective Action",
        owner: "QCQA",
        progress: 60,
        status: "Running"
    },

    {
        title: "Machine Maintenance",
        owner: "Maintenance",
        progress: 35,
        status: "Running"
    },

    {
        title: "Material Inspection",
        owner: "Warehouse",
        progress: 100,
        status: "Completed"
    }

];