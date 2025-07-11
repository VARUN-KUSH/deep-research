"use client"
import React, { useState } from 'react';
import OpenAI from 'openai'; // Import OpenAI client for LLM calls

// Main App component for the Deep Research API frontend
const App = () => {
    // State variables to manage form inputs and application data
    const [query, setQuery] = useState(''); // Stores the user's research query (original)
    const [selectedModels, setSelectedModels] = useState([]); // Stores selected research models
    const [recipientEmail, setRecipientEmail] = useState(''); // Stores the recipient email
    const [promptRewritingEnabled, setPromptRewritingEnabled] = useState(false); // Controls prompt rewriting feature
    const [rewrittenPrompt, setRewrittenPrompt] = useState(''); // Stores the prompt rewritten by the model
    const [showPromptConfirmation, setShowPromptConfirmation] = useState(false); // Controls visibility of prompt confirmation UI
    const [finalPromptForResearch, setFinalPromptForResearch] = useState(''); // The prompt (original or rewritten) sent to backend
    const [researchAnalysis, setResearchAnalysis] = useState(null); // Stores the research analysis result
    const [citations, setCitations] = useState([]); // Stores the citations
    const [isLoading, setIsLoading] = useState(false); // Indicates if an API call is in progress
    const [message, setMessage] = useState(''); // Displays user feedback messages (success/error)

    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true // Use environment variable for OpenAI API key
    });
    // Function to handle changes in text input fields (query, email)
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'query') {
            setQuery(value);
        } else if (name === 'recipient_email') {
            setRecipientEmail(value);
        }
    };

    // Function to handle changes in the multi-select dropdown for models
    const handleSelectChange = (e) => {
        // Get all selected options from the dropdown
        const options = Array.from(e.target.selectedOptions);
        // Map them to their values and update the state
        const values = options.map(option => option.value);
        setSelectedModels(values);
    };

    // Function to handle changes in the prompt rewriting checkbox
    const handleCheckboxChange = (e) => {
        setPromptRewritingEnabled(e.target.checked);
        // Reset rewritten prompt and confirmation UI if checkbox is unchecked
        if (!e.target.checked) {
            setRewrittenPrompt('');
            setShowPromptConfirmation(false);
            setFinalPromptForResearch('');
        }
    };

    // Function to initiate the research process (either directly or after prompt rewriting)
    const initiateResearch = async (promptToUse) => {
        setIsLoading(true); // Set loading state to true
        setMessage('Sending research request to backend...');

        try {
            // Simulate an API call to fetch research analysis
            const response = await fetch('/api/getresearch', { // Replace with your actual Django backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: finalPromptForResearch, // Use the confirmed prompt
                    instruction: promptToUse,
                    models: selectedModels,
                    recipient_email: recipientEmail,
                    prompt_rewriting: promptRewritingEnabled, // Still send this flag to backend

                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch research analysis');
            }

            const data = await response.json();
            setResearchAnalysis(data.analysis); // Set the research analysis result
            setCitations(data.citations || []); // Set the citations, defaulting to an empty array if none are provided
            setMessage('Research completed successfully! Analysis sent to your email.'); // Success message
            setShowPromptConfirmation(false); // Hide confirmation UI after research
            setRewrittenPrompt(''); // Clear rewritten prompt
        } catch (error) {
            console.error('Error during research:', error);
            setMessage('An error occurred during research. Please try again.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    // Function to handle the initial form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Clear previous results and messages
        setResearchAnalysis(null);
        setCitations([]);
        setMessage('');
        setRewrittenPrompt('');
        setShowPromptConfirmation(false);
        setFinalPromptForResearch('');

        // Basic validation
        if (!query.trim()) {
            setMessage('Please enter a research query.');
            return;
        }
        if (selectedModels.length === 0) {
            setMessage('Please select at least one model.');
            return;
        }
        if (!recipientEmail.trim()) {
            setMessage('Please enter a recipient email.');
            return;
        }

        setIsLoading(true); // Set loading state to true

        if (promptRewritingEnabled) {
            setMessage('Rewriting your prompt...');
            try {
                // Simulate LLM call for prompt rewriting
                const instructions = `
                You will be given a research task by a user. Your job is to produce a set of
                instructions for a researcher that will complete the task. Do NOT complete the
                task yourself, just provide instructions on how to complete it.

                GUIDELINES:
                1. **Maximize Specificity and Detail**
                - Include all known user preferences and explicitly list key attributes or
                dimensions to consider.
                - It is of utmost importance that all details from the user are included in
                the instructions.

                2. **Fill in Unstated But Necessary Dimensions as Open-Ended**
                - If certain attributes are essential for a meaningful output but the user
                has not provided them, explicitly state that they are open-ended or default
                to no specific constraint.

                3. **Avoid Unwarranted Assumptions**
                - If the user has not provided a particular detail, do not invent one.
                - Instead, state the lack of specification and guide the researcher to treat
                it as flexible or accept all possible options.

                4. **Use the First Person**
                - Phrase the request from the perspective of the user.

                5. **Tables**
                - If you determine that including a table will help illustrate, organize, or
                enhance the information in the research output, you must explicitly request
                that the researcher provide them.

                Examples:
                - Product Comparison (Consumer): When comparing different smartphone models,
                request a table listing each model's features, price, and consumer ratings
                side-by-side.
                - Project Tracking (Work): When outlining project deliverables, create a table
                showing tasks, deadlines, responsible team members, and status updates.
                - Budget Planning (Consumer): When creating a personal or household budget,
                request a table detailing income sources, monthly expenses, and savings goals.
                - Competitor Analysis (Work): When evaluating competitor products, request a
                table with key metrics, such as market share, pricing, and main differentiators.

                6. **Headers and Formatting**
                - You should include the expected output format in the prompt.
                - If the user is asking for content that would be best returned in a
                structured format (e.g. a report, plan, etc.), ask the researcher to format
                as a report with the appropriate headers and formatting that ensures clarity
                and structure.

                7. **Language**
                - If the user input is in a language other than English, tell the researcher
                to respond in this language, unless the user query explicitly asks for the
                response in a different language.

                8. **Sources**
                - If specific sources should be prioritized, specify them in the prompt.
                - For product and travel research, prefer linking directly to official or
                primary websites (e.g., official brand sites, manufacturer pages, or
                reputable e-commerce platforms like Amazon for user reviews) rather than
                aggregator sites or SEO-heavy blogs.
                - For academic or scientific queries, prefer linking directly to the original
                paper or official journal publication rather than survey papers or secondary
                summaries.
                - If the query is in a specific language, prioritize sources published in that
                language.
                `;

                const input = "Research surfboards for me. I'm interested in ...";

                const rewriteResult = await openai.responses.create({
                    model: "gpt-4.1",
                    input,
                    instructions,
                });

                console.log(rewriteResult.output_text);
                // console.log("rewriteResult", rewriteResult)
                if (rewriteResult && rewriteResult.output_text) {
                    const newPrompt = rewriteResult.output_text;
                    setRewrittenPrompt(newPrompt);
                    setFinalPromptForResearch(query)
                    setShowPromptConfirmation(true); // Show the confirmation UI
                    setMessage('Please review the rewritten prompt below.');
                } else {
                    setMessage('Failed to rewrite prompt. Proceeding with original query.');
                    setFinalPromptForResearch(query); // Use original query if rewrite fails
                    // initiateResearch(query); // Proceed with research using original prompt
                }
            } catch (error) {
                console.error('Error during prompt rewriting:', error);
                setMessage('An error occurred during prompt rewriting. Proceeding with original query.');
                // setFinalPromptForResearch(query); // Use original query on error
                // initiateResearch(query); // Proceed with research using original prompt
            } finally {
                setIsLoading(false); // Reset loading state after prompt rewriting attempt
            }
        } else {
            // If prompt rewriting is not enabled, directly initiate research with the original query
            setFinalPromptForResearch(query);
            initiateResearch(query);
        }
    };

    // Function to handle confirmation of the rewritten prompt
    const handleConfirmRewrittenPrompt = () => {
        setFinalPromptForResearch(rewrittenPrompt); // Set the rewritten prompt as the final one
        setShowPromptConfirmation(false); // Hide the confirmation UI
        initiateResearch(rewrittenPrompt); // Proceed with research using the rewritten prompt
    };

    // Function to handle editing the rewritten prompt (if user wants to modify it)
    const handleEditRewrittenPrompt = () => {
        setShowPromptConfirmation(false); // Hide confirmation UI
        setQuery(rewrittenPrompt); // Set the rewritten prompt back to the main query input for editing
        setRewrittenPrompt(''); // Clear rewritten prompt state
        setMessage('You can now edit the rewritten prompt in the query box.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
                    Deep Research
                </h1>

                {/* Message display area */}
                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-center ${isLoading ? 'bg-blue-100 text-blue-800' : researchAnalysis ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} shadow-sm`}>
                        {message}
                    </div>
                )}

                {!showPromptConfirmation ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Research Query Input */}
                        <div>
                            <label htmlFor="query" className="block text-lg font-medium text-gray-700 mb-2">
                                Enter your research query:
                            </label>
                            <textarea
                                id="query"
                                name="query"
                                rows="4"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base resize-y text-black"
                                placeholder="e.g., 'Impact of AI on climate change solutions'"
                                value={query}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        {/* Model Selection */}
                        <div>
                            <label htmlFor="model-select" className="block text-lg font-medium text-gray-700 mb-2">
                                Choose models:
                            </label>
                            <select
                                id="model-select"
                                name="models"
                                multiple
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base h-32 text-black"
                                value={selectedModels}
                                onChange={handleSelectChange}
                                required
                            >
                                <option value="o3-deep-research">o3-deep-research</option>
                                <option value="o4-mini-deep-research">o4-mini-deep-research</option>

                            </select>
                            <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple models.</p>
                        </div>

                        {/* Recipient Email Input */}
                        <div>
                            <label htmlFor="recipient_email" className="block text-lg font-medium text-gray-700 mb-2">
                                Recipient Email:
                            </label>
                            <input
                                type="email"
                                id="recipient_email"
                                name="recipient_email"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base text-black"
                                placeholder="your.email@example.com"
                                value={recipientEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Prompt Rewriting Option */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="prompt-rewriting"
                                name="prompt-rewriting"
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={promptRewritingEnabled}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="prompt-rewriting" className="ml-3 block text-lg font-medium text-gray-700">
                                Enable Prompt Rewriting (optional)
                            </label>
                        </div>

                        {/* Research Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Research'
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    // Prompt Confirmation UI
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Rewritten Prompt</h2>
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-inner">
                            <p className="text-gray-800 leading-relaxed text-base">{rewrittenPrompt}</p>
                        </div>
                        <p className="text-lg text-gray-700 text-center">Do you want to use this rewritten prompt for your research?</p>
                        <div className="flex justify-center space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={handleConfirmRewrittenPrompt}
                                className="flex-1 py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                Confirm and Research
                            </button>
                            <button
                                type="button"
                                onClick={handleEditRewrittenPrompt}
                                className="flex-1 py-3 px-6 border border-gray-300 rounded-lg shadow-md text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                Edit Original Prompt
                            </button>
                        </div>
                    </div>
                )}

                {/* Display Research Analysis and Citations */}
                {researchAnalysis && (
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Research Analysis</h2>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-gray-800 leading-relaxed text-base">
                            <p>{researchAnalysis}</p>
                        </div>

                        {citations.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Citations</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
                                    {citations.map((citation, index) => (
                                        <li key={index}>{citation}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
