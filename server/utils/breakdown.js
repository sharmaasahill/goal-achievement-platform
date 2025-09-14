export function suggestDurationWeeks(goalTitle) {
    const t = (goalTitle || "").toLowerCase();
    if (t.includes("machine learning") || t.includes("data scientist")) return 16;
    if (t.includes("dsa") || t.includes("algorithms")) return 10;
    if (t.includes("full-stack") || t.includes("full stack")) return 12;
    return 8; // default
}

export function generateChunks(title, durationWeeks) {
    const goalLower = title.toLowerCase();
    const chunks = [];
    
    if (goalLower.includes("data scientist") || goalLower.includes("machine learning")) {
        const phases = [
            { week: 1, title: "Statistics & Math Foundations", desc: "Review basic statistics, probability, and linear algebra concepts" },
            { week: 2, title: "Python Programming", desc: "Master Python basics, NumPy, and Pandas for data manipulation" },
            { week: 3, title: "Data Visualization", desc: "Learn Matplotlib, Seaborn, and create compelling visualizations" },
            { week: 4, title: "Data Cleaning & EDA", desc: "Practice data cleaning, exploratory data analysis techniques" },
            { week: 5, title: "Machine Learning Basics", desc: "Introduction to supervised learning, train/test splits" },
            { week: 6, title: "Linear Regression", desc: "Implement linear regression from scratch and using libraries" },
            { week: 7, title: "Classification Algorithms", desc: "Logistic regression, decision trees, random forests" },
            { week: 8, title: "Model Evaluation", desc: "Cross-validation, metrics, bias-variance tradeoff" },
            { week: 9, title: "Feature Engineering", desc: "Feature selection, scaling, encoding categorical variables" },
            { week: 10, title: "Advanced Algorithms", desc: "SVM, KNN, ensemble methods" },
            { week: 11, title: "Unsupervised Learning", desc: "Clustering, dimensionality reduction (PCA)" },
            { week: 12, title: "Project Portfolio", desc: "Build 2-3 complete data science projects" },
            { week: 13, title: "Deep Learning Intro", desc: "Neural networks, TensorFlow/PyTorch basics" },
            { week: 14, title: "Advanced Topics", desc: "Time series, NLP, or computer vision basics" },
            { week: 15, title: "Deployment & MLOps", desc: "Model deployment, monitoring, version control" },
            { week: 16, title: "Final Portfolio", desc: "Complete portfolio with 5+ projects, prepare for interviews" }
        ];
        
        for (let i = 1; i <= Math.min(durationWeeks, phases.length); i++) {
            const phase = phases[i - 1];
            chunks.push({
                title: `Week ${i} — ${phase.title}`,
                description: phase.desc,
                weekIndex: i,
                completed: false
            });
        }
    } else if (goalLower.includes("full stack") || goalLower.includes("web development")) {
        const phases = [
            { week: 1, title: "HTML & CSS Fundamentals", desc: "Master semantic HTML, CSS Grid, Flexbox, responsive design" },
            { week: 2, title: "JavaScript Basics", desc: "ES6+, DOM manipulation, async programming" },
            { week: 3, title: "Frontend Framework", desc: "Learn React/Vue basics, components, state management" },
            { week: 4, title: "Backend Fundamentals", desc: "Node.js/Python, Express/FastAPI, REST APIs" },
            { week: 5, title: "Database Design", desc: "SQL/NoSQL, database modeling, queries" },
            { week: 6, title: "Authentication & Security", desc: "JWT, OAuth, password hashing, CORS" },
            { week: 7, title: "API Development", desc: "Build RESTful APIs, error handling, validation" },
            { week: 8, title: "Frontend-Backend Integration", desc: "Connect frontend to APIs, state management" },
            { week: 9, title: "Testing", desc: "Unit tests, integration tests, testing frameworks" },
            { week: 10, title: "Deployment", desc: "Docker, cloud platforms, CI/CD basics" },
            { week: 11, title: "Performance Optimization", desc: "Code splitting, caching, database optimization" },
            { week: 12, title: "Final Project", desc: "Build a complete full-stack application" }
        ];
        
        for (let i = 1; i <= Math.min(durationWeeks, phases.length); i++) {
            const phase = phases[i - 1];
            chunks.push({
                title: `Week ${i} — ${phase.title}`,
                description: phase.desc,
                weekIndex: i,
                completed: false
            });
        }
    } else if (goalLower.includes("dsa") || goalLower.includes("algorithms")) {
        const phases = [
            { week: 1, title: "Array Fundamentals", desc: "Array manipulation, two pointers, sliding window" },
            { week: 2, title: "String Algorithms", desc: "String manipulation, pattern matching, parsing" },
            { week: 3, title: "Linked Lists", desc: "Singly/doubly linked lists, common operations" },
            { week: 4, title: "Stacks & Queues", desc: "Implementation, applications, monotonic stacks" },
            { week: 5, title: "Hash Tables", desc: "Hash maps, sets, collision handling" },
            { week: 6, title: "Binary Trees", desc: "Tree traversal, BST operations, tree problems" },
            { week: 7, title: "Graph Basics", desc: "Graph representation, BFS, DFS" },
            { week: 8, title: "Graph Algorithms", desc: "Shortest path, topological sort, cycle detection" },
            { week: 9, title: "Dynamic Programming", desc: "Memoization, tabulation, common DP patterns" },
            { week: 10, title: "Greedy Algorithms", desc: "Greedy strategies, interval scheduling" },
            { week: 11, title: "Advanced Topics", desc: "Trie, segment trees, advanced data structures" },
            { week: 12, title: "System Design Basics", desc: "Scalability, caching, load balancing concepts" }
        ];
        
        for (let i = 1; i <= Math.min(durationWeeks, phases.length); i++) {
            const phase = phases[i - 1];
            chunks.push({
                title: `Week ${i} — ${phase.title}`,
                description: phase.desc,
                weekIndex: i,
                completed: false
            });
        }
    } else {
        // Generic goal breakdown
        for (let i = 1; i <= durationWeeks; i++) {
            chunks.push({
                title: `Week ${i} — ${title} Progress`,
                description: `Focus for week ${i}: Learn and practice the next module/task related to your goal.`,
                weekIndex: i,
                completed: false
            });
        }
    }
    
    return chunks;
}

export function recalcProgress(chunks) {
    if (!chunks?.length) return 0;
    const done = chunks.filter(c => c.completed).length;
    return Math.round((done / chunks.length) * 100);
}
