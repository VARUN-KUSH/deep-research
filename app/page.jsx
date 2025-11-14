// "use client"
// import React, { useState, useEffect } from 'react';
// import OpenAI from 'openai'; // Import OpenAI client for LLM calls
// import { z } from "zod";
// import { zodTextFormat } from "openai/helpers/zod";
// import Image from 'next/image'
// // Define the Zod schema for the structured output
// const IndustryNames = z.object({
//     commonNames: z.array(z.string()),
// });

// // Main App component for the Deep Research API frontend

// const App = () => {
//     // State variables to manage form inputs and application data
//     // Removed 'query' state as the direct input field is being removed.
//     const [selectedModelCompany, setSelectedModelCompany] = useState('ChatGPT'); // New state for selected model company
//     const [availableModels, setAvailableModels] = useState([]); // New state for dynamically available models
//     const [selectedModels, setSelectedModels] = useState([]); // Stores selected research models
//     const [recipientEmail, setRecipientEmail] = useState(''); // Stores the recipient email
//     const [Industry_Name, setIndustry_Name] = useState('');
//     const [promptRewritingEnabled, setPromptRewritingEnabled] = useState(false); // Controls prompt rewriting feature
//     const [clarifyingQuestionsEnabled, setClarifyingQuestionsEnabled] = useState(false); // New state for clarifying questions feature
//     const [industryName, setIndustryName] = useState([]); // State for industry name
//     const [industryAnalysis, setIndustryAnalysis] = useState(null); // State for industry analysis result

//     const [rewrittenPrompt, setRewrittenPrompt] = useState(''); // Stores the prompt rewritten by the model
//     const [showPromptConfirmation, setShowPromptConfirmation] = useState(false); // Controls visibility of prompt confirmation UI
//     const [finalPromptForResearch, setFinalPromptForResearch] = useState(''); // The prompt (rewritten) sent to backend
//     const [researchAnalysis, setResearchAnalysis] = useState(null); // Stores the research analysis result
//     const [citations, setCitations] = useState([]); // Stores the citations
//     const [isLoading, setIsLoading] = useState(false); // Indicates if an API call is in progress
//     const [isLoadingResearch, setIsLoadingResearch] = useState(false);
//     const [message, setMessage] = useState(''); // Displays user feedback messages (success/error)
//     const [reasoning, setReasoning] = useState([]); // Stores reasoning output if available
//     const [webSearchCall, setWebSearchCall] = useState(null); // Stores web search call output if available


//     const openai = new OpenAI({
//         apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true
//     });

//     // Define model options based on company
//     const modelOptions = {
//         '': [], // Default empty
//         'ChatGPT': [
//             { value: 'o3-deep-research', label: 'o3-deep-research' },
//             { value: 'o4-mini-deep-research', label: 'o4-mini-deep-research' },

//         ],
//         'Gemini': [
//             { value: 'gemini-pro', label: 'Gemini Pro' },
//             { value: 'gemini-flash', label: 'Gemini Flash' },
//         ],
//         'Groq': [
//             { value: 'llama2-70b', label: 'Llama 2 70B' },
//             { value: 'mixtral-8x7b', label: 'Mixtral 8x7B' },
//         ],
//         'Other': [
//             { value: 'custom-model-1', label: 'Custom Model 1' },
//             { value: 'custom-model-2', label: 'Custom Model 2' },
//         ],
//     };

//     function advancedmodelsConfig() {
//         return (
//             //  {/* Model Selection (dynamic based on company) */}
//             <div>
//                 <div>
//                     <div className="mt-6">
//                         <label htmlFor="model-company-select" className="block text-lg font-medium text-gray-700 mb-2">
//                             Choose Model Company:
//                         </label>
//                         <select
//                             id="model-company-select"
//                             name="model-company"
//                             className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base text-black"
//                             value={selectedModelCompany}
//                             onChange={handleModelCompanyChange}
//                             required
//                         >

//                             <option value="ChatGPT">ChatGPT</option>
//                             <option value="Gemini">Gemini</option>
//                             <option value="Groq">Groq</option>
//                             <option value="Other">Other</option>
//                         </select>

//                     </div>

//                     <label htmlFor="model-select" className="block text-lg font-medium text-gray-700 mb-2">
//                         Choose models:
//                     </label>
//                     <select
//                         id="model-select"
//                         name="models"
//                         multiple
//                         className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base h-32 text-black"
//                         value={selectedModels}
//                         onChange={handleSelectChange}
//                         required={availableModels.length > 0} // Require selection only if options are available
//                         disabled={availableModels.length === 0} // Disable if no options
//                     >
//                         {availableModels.length === 0 && <option value="">Select a model company first</option>}
//                         {availableModels.map(model => (
//                             <option key={model.value} value={model.value}>{model.label}</option>
//                         ))}
//                     </select>
//                     <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple models.</p>
//                 </div>

//                 {/* Audio Summary Model Selection (New) */}
//                 {/* <div>
//                  <label htmlFor="audio-model-select" className="block text-lg font-medium text-gray-700 mb-2">
//                      Choose models for Audio Summary:
//                  </label>
//                  <select
//                      id="audio-model-select"
//                      name="audio-models"
//                      multiple
//                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base h-32 text-black"
//                      value={selectedAudioModels}
//                      onChange={handleAudioModelChange}
//                  >
//                      {Object.entries(modelOptions).flatMap(([company, models]) => 
//                          models.length > 0 ? (
//                              <optgroup label={company} key={company}>
//                                  {models.map(model => (
//                                      <option key={model.value} value={model.value}>{model.label}</option>
//                                  ))}
//                              </optgroup>
//                          ) : null
//                      )}
//                  </select>
//                  <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple models.</p>
//              </div> */}

//                 {/* Recipient Email Input */}

//                 {/* Prompt Rewriting Option */}
//                 <div className="flex items-center">
//                     <input
//                         type="checkbox"
//                         id="prompt-rewriting"
//                         name="prompt-rewriting"
//                         className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         checked={promptRewritingEnabled}
//                         onChange={handlePromptRewritingChange}
//                     />
//                     <label htmlFor="prompt-rewriting" className="ml-3 block text-lg font-medium text-gray-700">
//                         Enable Prompt Rewriting
//                     </label>
//                 </div>

//                 {/* Asking Clarifying Questions Option */}
//                 <div className="flex items-center">
//                     <input
//                         type="checkbox"
//                         id="clarifying-questions"
//                         name="clarifying-questions"
//                         className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         checked={clarifyingQuestionsEnabled}
//                         onChange={handleClarifyingQuestionsChange}
//                     />
//                     <label htmlFor="clarifying-questions" className="ml-3 block text-lg font-medium text-gray-700">
//                         Asking Clarifying Questions
//                     </label>
//                 </div>

//                 {/* ) : (
//                     // Prompt Confirmation UI
//                     <div className="space-y-6">
//                         <h2 className="text-2xl font-bold text-gray-800 mb-4">Rewritten Prompt</h2>
//                         <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow-inner">
//                             <p className="text-gray-800 leading-relaxed text-base">{rewrittenPrompt}</p>
//                         </div>
//                         <p className="text-lg text-gray-700 text-center">Do you want to use this rewritten prompt for your research?</p>
//                         <div className="flex justify-center space-x-4 mt-6">
//                             <button
//                                 type="button"
//                                 onClick={handleConfirmRewrittenPrompt}
//                                 className="flex-1 py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
//                                 disabled={isLoading}
//                             >
//                                 Confirm and Research
//                             </button>
//                             <button
//                                 type="button"
//                                 onClick={handleEditRewrittenPrompt}
//                                 className="flex-1 py-3 px-6 border border-gray-300 rounded-lg shadow-md text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
//                                 disabled={isLoading}
//                             >
//                                 Clear Rewritten Prompt
//                             </button>
//                         </div>
//                     </div>
//                 )} */}

//             </div>
//         )
//     }

//     // Effect to update available models when selectedModelCompany changes
//     useEffect(() => {
//         setAvailableModels(modelOptions[selectedModelCompany] || []);
//         setSelectedModels([]); // Clear selected models when company changes
//     }, [selectedModelCompany]); // Depend on selectedModelCompany

//     // Function to handle changes in text input fields (email, industry name)
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         // Removed 'query' handling as the direct input field is removed
//         if (name === 'recipient_email') {
//             setRecipientEmail(value);
//         } else if (name === 'industry_name') {
//             setIndustryName(value);
//         } else if (name === 'Industry_Name') {
//             setIndustry_Name(value);
//         }
//         // Handle other fields as needed
//     };

//     // Function to handle changes in the multi-select dropdown for models
//     const handleSelectChange = (e) => {
//         const options = Array.from(e.target.selectedOptions);
//         const values = options.map(option => option.value);
//         setSelectedModels(values);
//     };

//     // Function to handle changes in the model company dropdown
//     const handleModelCompanyChange = (e) => {
//         setSelectedModelCompany(e.target.value);
//     };

//     // Function to handle changes in the prompt rewriting checkbox
//     const handlePromptRewritingChange = (e) => {
//         setPromptRewritingEnabled(e.target.checked);
//         if (!e.target.checked) {
//             setRewrittenPrompt('');
//             setShowPromptConfirmation(false);
//             setFinalPromptForResearch('');
//         }
//     };

//     // Function to handle changes in the clarifying questions checkbox
//     const handleClarifyingQuestionsChange = (e) => {
//         setClarifyingQuestionsEnabled(e.target.checked);
//     };

//     // Function to initiate the research process (either directly or after prompt rewriting)
//     const initiateResearch = async (promptToUse) => {

//         if (!recipientEmail || !recipientEmail.includes('@accessholdings.com')) {
//             // If validation fails, set the error message
//             setMessage("sorry, you are not allowed to run this process");

//             // Set a timer to clear the message after 2 seconds
//             setTimeout(() => {
//                 setMessage(''); // Clear the message
//             }, 2000);

//             // Stop the function execution
//             return;
//         }

//         setIsLoadingResearch(true);
//         setMessage('Sending deep research request to backend...');

//         try {
//             const response = await fetch(' https://10092bdb255b.ngrok-free.app/api/generate-report', { // Replace with your actual Django backend endpoint
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     // query: promptToUse, // Use the confirmed prompt
//                     models: selectedModels,
//                     recipient_email: recipientEmail,
//                     industry_name: Industry_Name, // Include industry name for analysis
//                     // prompt_rewriting: promptRewritingEnabled,
//                     // clarifying_questions: clarifyingQuestionsEnabled, // Send new state to backend
//                 }),
//             });

//             if (response.status !== 202) {
//                 // Use the message from the JSON data for the error
//                 throw new Error(`Failed to fetch research analysis.`);
//             }

//             let res = await response.json();
//             console.log("Full response from backend>>>", res);
//             //    Check the status on the 'response' object


//             // This part is now correct
//             console.log("response from backend>>>", res.message);
//             setMessage(res.message);
//             // setResearchAnalysis(data.output_text);
//             // let reasoning = [];
//             // for (const item of data.output) {
//             //     if (item.type === "reasoning") {
//             //         reasoning.push(item.summary.map(s => s.text).join(' '));
//             //         break;
//             //     }
//             // }
//             // let search = [];
//             // for (const item of data.output) {
//             //     if (item.type === "web_search_call") {
//             //         search.push(item.action);
//             //         break;
//             //     }
//             // }
//             // console.log("Reasoning:", reasoning);
//             // console.log("Web Search Call:", search);
//             // setReasoning(reasoning);
//             // setWebSearchCall(search);
//             // setCitations(data.citations || []);
//             // setMessage('Deep research completed successfully! Analysis sent to your email.');
//             // setShowPromptConfirmation(false);
//             // setRewrittenPrompt('');
//         } catch (error) {
//             console.error('Error during research:', error);
//             setMessage('An error occurred during deep research. Please try again.');
//         } finally {
//             setIsLoadingResearch(false);
//         }
//     };

//     // Function to handle the initial form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setResearchAnalysis(null);
//         setCitations([]);
//         setMessage('');
//         setRewrittenPrompt('');
//         setShowPromptConfirmation(false);
//         setFinalPromptForResearch('');
//         // setIndustryAnalysis(null);

//         // Validation for models and email remains
//         if (selectedModels.length === 0) {
//             setMessage('Please select at least one model.');
//             return;
//         }
//         if (!recipientEmail.trim()) {
//             setMessage('Please enter a recipient email.');
//             return;
//         }

//         setIsLoading(true);

//         if (!promptRewritingEnabled) {
//             setMessage('Rewriting your prompt...');
//             try {
//                 // The prompt for rewriting now needs to be generic or based on other inputs.
//                 // If industryName is available, use it as context. Otherwise, generate a general research prompt.
//                 handleConfirmRewrittenPrompt()

//             } catch (error) {
//                 console.error('Error during prompt rewriting:', error);
//                 setMessage('An error occurred during prompt rewriting. Please try again.');
//                 setFinalPromptForResearch(''); // Clear final prompt on error
//             } finally {
//                 setIsLoading(false);
//             }
//         } else {
//             // If prompt rewriting is NOT enabled, and there's no direct query input,
//             // we cannot proceed with research.
//             setMessage('Please enable "Prompt Rewriting" to generate a research query, or provide a query through other means.');
//             setIsLoading(false);
//         }
//     };

//     // Function to handle industry analysis
//     const handleIndustryAnalysis = async () => {
//         setIsLoading(true);
//         setMessage(`Analyzing the ${industryName} industry...`);
//         setIndustryAnalysis(null);

//         if (!industryName.trim()) {
//             setMessage('Please enter an industry name for analysis.');
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const industryPrompt = `identify the most commonly accepted names for this ${industryName} industry.`;


//             const response = await openai.responses.create({
//                 input: industryPrompt,
//                 model: "gpt-5", // Changed to gpt-4o, often slightly better for detailed responses than latest if there are subtle differences in 'latest' deployment          
//                 text: {
//                     format: zodTextFormat(IndustryNames, "commonNames"),
//                 }
//             });
//             console.log("Received response:", response);

//             if (response && response.output_text) {
//                 try {
//                     const parsedData = JSON.parse(response.output_text); // Parse the JSON string
//                     console.log("Parsed Data:", parsedData);
//                     if (parsedData && Array.isArray(parsedData.commonNames)) {
//                         setIndustryAnalysis(parsedData.commonNames); // Set the commonNames array to state
//                         setMessage(`Common names for ${industryName} retrieved.`);
//                     } else {
//                         setMessage(`Invalid response format for ${industryName}. Please try again.`);
//                     }
//                 } catch (parseError) {
//                     console.error("Error parsing JSON:", parseError);
//                     setMessage(`Failed to parse response for ${industryName}. Please try again.`);
//                 }
//             } else {
//                 setMessage(`Failed to get analysis for ${industryName}. Please try again.`);
//             }
//         } catch (error) {
//             console.error('Error during industry analysis:', error);
//             setMessage('An error occurred during industry analysis. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };


//     // Function to handle confirmation of the rewritten prompt
//     const handleConfirmRewrittenPrompt = () => {
//         // finalPromptForResearch is already set by handleSubmit
//         setShowPromptConfirmation(false);
//         initiateResearch(finalPromptForResearch);
//     };

//     // Function to handle editing the rewritten prompt (if user wants to modify it)
//     const handleEditRewrittenPrompt = () => {
//         setShowPromptConfirmation(false);
//         // When editing, set the rewritten prompt back into the main query input for editing
//         // Since there's no longer a direct query input, we set it to the rewrittenPrompt
//         // and expect the user to manually copy/paste or re-trigger prompt rewriting.
//         // For now, we'll just clear the rewritten prompt and message.
//         setRewrittenPrompt('');
//         setMessage('You can re-enable Prompt Rewriting to generate a new prompt.');
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
//             <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">

//                 <div className='flex justify-center mb-14'>
//                     <Image
//                         src="/icon.png"
//                         width={250}
//                         height={250}
//                         alt="Picture of the author"
//                     />
//                 </div>


//                 {/* Industry Analysis Input */}
//                 <div className="mb-6">
//                     <label htmlFor="industry-name" className="block text-lg font-medium text-gray-700 mb-2">
//                         Industry Name for Analysis:
//                     </label>
//                     <div className="flex space-x-3">
//                         <input
//                             type="text"
//                             id="industry-name"
//                             name="industry_name"
//                             className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base text-black"
//                             placeholder="e.g., 'Pest Control'"
//                             value={industryName}
//                             onChange={handleChange}
//                         />
//                         <button
//                             type="button"
//                             onClick={handleIndustryAnalysis}
//                             className="py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? (
//                                 <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                             ) : (
//                                 'Analyze Industry'
//                             )}
//                         </button>
//                     </div>
//                 </div>


//                 {/* Display Industry Analysis */}



//                 {/* Message display area */}
//                 {message && (
//                     <div className={`p-3 mb-4 rounded-lg text-center ${isLoading ? 'bg-blue-100 text-blue-800' : researchAnalysis || industryAnalysis ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} shadow-sm`}>
//                         {message}
//                     </div>
//                 )}

//                 {/* {!showPromptConfirmation ? ( */}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Research Query Input (single) - REMOVED */}
//                     {/* The research query will now be generated via Prompt Rewriting */}

//                     {/* Model Company Selection */}
//                     <div>
//                         <div>
//                             <label htmlFor="Industry_Name" className="block text-lg font-medium text-gray-700 mb-2">
//                                 Industry Name:
//                             </label>
//                             <select
//                                 id="Industry_Name"
//                                 name='Industry_Name'
//                                 className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base text-black bg-white"
//                                 value={Industry_Name}
//                                 onChange={handleChange}
//                                 required
//                             >
//                                 <option value="" disabled>Select an industry</option>
//                                 {industryAnalysis?.map((name) => (
//                                     <option key={name} value={name}>{name}</option>
//                                 ))}
//                             </select>
//                         </div >

//                         <div>
//                             <label htmlFor="recipient_email" className="block text-lg font-medium text-gray-700 mb-2 mt-8">
//                                 Recipient Email:
//                             </label>
//                             <input
//                                 type="email"
//                                 id="recipient_email"
//                                 name="recipient_email"
//                                 className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base text-black"
//                                 placeholder="your.email@example.com"
//                                 value={recipientEmail}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>


//                     </div>



//                     {/* Research Button */}
//                     <div>
//                         <button
//                             type="submit"
//                             className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
//                             disabled={isLoadingResearch} // Disable if rewriting not enabled
//                         >
//                             {isLoadingResearch ? (
//                                 <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                             ) : (
//                                 'Start Research' // Clarified button text
//                             )}
//                         </button>
//                     </div>
//                 </form>


//                 {/* Display Research Analysis and Citations */}
//                 {researchAnalysis && (
//                     <div className="mt-10 pt-8 border-t border-gray-200">
//                         <h2 className="text-3xl font-bold text-gray-800 mb-4">Research Analysis</h2>
//                         <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-gray-800 leading-relaxed text-base">
//                             <p>{researchAnalysis}</p>
//                         </div>

//                         {citations.length > 0 && (
//                             <div className="mt-8">
//                                 {/* Citations display area - currently commented out in your original code */}
//                             </div>
//                         )}

//                         {reasoning.length > 0 && (
//                             <div className="mt-8">
//                                 <h3 className="text-2xl font-semibold text-gray-800 mb-3">Reasoning</h3>
//                                 <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
//                                     {reasoning.map((item, index) => (
//                                         <li key={index}>{item}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                         {webSearchCall.length > 0 && (
//                             <div className="mt-8">
//                                 <h3 className="text-2xl font-semibold text-gray-800 mb-3">Web Search Calls</h3>
//                                 <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
//                                     {webSearchCall.map((item, index) => (
//                                         <li key={index}>{JSON.stringify(item)}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default App;



// // Function to render formatted industry analysis
// // const renderIndustryAnalysis = (text) => {
// //     if (!text) return null;

// //     // Attempt to parse the structure based on the example provided
// //     const parts = text.split('\n\n').filter(p => p.trim() !== '');
// //     let overview = '';
// //     let keyAspects = [];
// //     let commonlyAcceptedNames = [];

// //     // Simple parsing logic (can be made more robust if needed)
// //     let currentSection = '';
// //     parts.forEach(part => {
// //         if (part.includes('Key aspects of the')) {
// //             overview = part.split('Key aspects of the')[0].trim();
// //             currentSection = 'keyAspects';
// //             const aspectsRaw = part.split('Key aspects of the')[1];
// //             aspectsRaw.split(/\d+\.\s\*\*(.*?)\*\*\s*:\s*(.*)/g).forEach((match, i, arr) => {
// //                 if (i % 3 === 1) { // Title is at index 1, 4, 7...
// //                     keyAspects.push({ title: match.trim(), description: arr[i+1].trim() });
// //                 }
// //             });
// //         } else if (part.includes('Commonly accepted names for this industry include:')) {
// //             currentSection = 'commonlyAcceptedNames';
// //             const namesRaw = part.split('Commonly accepted names for this industry include:')[1];
// //             namesRaw.split(/-\s*(.*)/g).forEach((match, i, arr) => {
// //                 if (i % 2 === 1) { // Name is at index 1, 3, 5...
// //                     commonlyAcceptedNames.push(match.trim());
// //                 }
// //             });
// //         } else if (currentSection === 'keyAspects' && part.match(/^\d+\.\s\*\*/)) {
// //             // This case is handled by the regex above, but keeping for clarity if new patterns emerge
// //         } else if (currentSection === 'commonlyAcceptedNames' && part.match(/^-/)) {
// //             // This case is handled by the regex above
// //         } else if (!overview) { // If overview hasn't been set yet
// //             overview += (overview ? '\n\n' : '') + part;
// //         }
// //     });

// //     return (
// //         <div className="space-y-4">
// //             {overview && <p className="text-gray-800 leading-relaxed text-base">{overview}</p>}

// //             {keyAspects.length > 0 && (
// //                 <div>
// //                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Key Aspects:</h3>
// //                     <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
// //                         {keyAspects.map((item, index) => (
// //                             <li key={index}>
// //                                 <strong>{item.title}</strong>: {item.description}
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </div>
// //             )}

// //             {commonlyAcceptedNames.length > 0 && (
// //                 <div>
// //                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Commonly Accepted Names:</h3>
// //                     <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
// //                         {commonlyAcceptedNames.map((name, index) => (
// //                             <li key={index}>{name}</li>
// //                         ))}
// //                     </ul>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

"use client"
import React, { useState, useEffect } from 'react';
import OpenAI from 'openai'; // Import OpenAI client for LLM calls
import { useRouter } from 'next/navigation';

/* import Image from 'next/image' // Removed Next.js Image component as it caused a build error. Replaced with standard <img> tag. */

// Define the Zod schema for the structured output


// --- Modal Component ---
// This is the popup that will show the advanced settings
const Modal = ({ children, title, onClose }) => (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 p-4">
        {/* Modal Content */}
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1.5 transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
                    aria-label="Close modal"
                >
                    {/* Close icon (X) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {/* Modal Body */}
            {children}
        </div>
    </div>
);


// Main App component for the Deep Research API frontend

const App = () => {
    // State variables to manage form inputs and application data
    // Removed 'query' state as the direct input field is being removed.
    const [selectedModelCompany, setSelectedModelCompany] = useState('ChatGPT'); // New state for selected model company
    const [availableModels, setAvailableModels] = useState([]); // New state for dynamically available models
    const [selectedModels, setSelectedModels] = useState(["o3-deep-research"]); // Stores selected research models
    const [recipientEmail, setRecipientEmail] = useState(''); // Stores the recipient email
    const [Industry_Name, setIndustry_Name] = useState('');
    const [promptRewritingEnabled, setPromptRewritingEnabled] = useState(false); // Controls prompt rewriting feature
    const [clarifyingQuestionsEnabled, setClarifyingQuestionsEnabled] = useState(false); // New state for clarifying questions feature
    const [industryName, setIndustryName] = useState([]); // State for industry name
    const [industryAnalysis, setIndustryAnalysis] = useState(null); // State for industry analysis result

    const [rewrittenPrompt, setRewrittenPrompt] = useState(''); // Stores the prompt rewritten by the model
    const [showPromptConfirmation, setShowPromptConfirmation] = useState(false); // Controls visibility of prompt confirmation UI
    const [finalPromptForResearch, setFinalPromptForResearch] = useState(''); // The prompt (rewritten) sent to backend
    const [researchAnalysis, setResearchAnalysis] = useState(null); // Stores the research analysis result
    const [citations, setCitations] = useState([]); // Stores the citations
    const [isLoading, setIsLoading] = useState(false); // Indicates if an API call is in progress
    const [isLoadingResearch, setIsLoadingResearch] = useState(false);
    const [message, setMessage] = useState(''); // Displays user feedback messages (success/error)
    const [reasoning, setReasoning] = useState([]); // Stores reasoning output if available
    const [webSearchCall, setWebSearchCall] = useState(null); // Stores web search call output if available
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // --- NEW STATE for settings modal ---
    const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);

    const router = useRouter();

    // Define model options based on company
    const modelOptions = {
        '': [], // Default empty
        'ChatGPT': [
            { value: 'o3-deep-research', label: 'o3-deep-research' },
            { value: 'o4-mini-deep-research', label: 'o4-mini-deep-research' },

        ],
        'Gemini': [
            { value: 'gemini-pro', label: 'Gemini Pro' },
            { value: 'gemini-flash', label: 'Gemini Flash' },
        ],
        'Groq': [
            { value: 'llama2-70b', label: 'Llama 2 70B' },
            { value: 'mixtral-8x7b', label: 'Mixtral 8x7B' },
        ],
        'Other': [
            { value: 'custom-model-1', label: 'Custom Model 1' },
            { value: 'custom-model-2', label: 'Custom Model 2' },
        ],
    };

    
    function advancedmodelsConfig() {
        return (
            //  This JSX will now appear inside the modal
            <div className="space-y-6">
                {/* Model Selection (dynamic based on company) */}
                <div>
                    <div className="mt-6">
                        <label htmlFor="model-company-select" className="block text-lg font-medium text-gray-700 mb-2">
                            Choose Model Company:
                        </label>
                        <select
                            id="model-company-select"
                            name="model-company"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base text-black"
                            value={selectedModelCompany}
                            onChange={handleModelCompanyChange}
                            required
                        >

                            <option value="ChatGPT">ChatGPT</option>
                            <option value="Gemini">Gemini</option>
                            <option value="Groq">Groq</option>
                            <option value="Other">Other</option>
                        </select>

                    </div>

                    <label htmlFor="model-select" className="block text-lg font-medium text-gray-700 mb-2 mt-4">
                        Choose models:
                    </label>
                    <select
                        id="model-select"
                        name="models"
                        multiple
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base h-32 text-black"
                        value={selectedModels}
                        onChange={handleSelectChange}
                        required={availableModels.length > 0} // Require selection only if options are available
                        disabled={availableModels.length === 0} // Disable if no options
                    >
                        {availableModels.length === 0 && <option value="">Select a model company first</option>}
                        {availableModels.map(model => (
                            <option key={model.value} value={model.value}>{model.label}</option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple models.</p>
                </div>

                {/* Audio Summary Model Selection (New) */}
                <div>
                    <label htmlFor="audio-model-select" className="block text-lg font-medium text-gray-700 mb-2">
                        Choose models for Audio Summary:
                    </label>
                    {/* <select
                      id="audio-model-select"
                      name="audio-models"
                      multiple
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base h-32 text-black"
                      value={selectedAudioModels}
                      onChange={handleAudioModelChange}
                  >
                      {Object.entries(modelOptions).flatMap(([company, models]) => 
                          models.length > 0 ? (
                              <optgroup label={company} key={company}>
                                  {models.map(model => (
                                      <option key={model.value} value={model.value}>{model.label}</option>
                                  ))}
                              </optgroup>
                          ) : null
                      )}
                  </select> */}
                    <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple models.</p>
                </div>

                {/* Prompt Rewriting Option */}
                <div className="flex items-center pt-4">
                    <input
                        type="checkbox"
                        id="prompt-rewriting"
                        name="prompt-rewriting"
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={promptRewritingEnabled}
                        onChange={handlePromptRewritingChange}
                    />
                    <label htmlFor="prompt-rewriting" className="ml-3 block text-lg font-medium text-gray-700">
                        Enable Prompt Rewriting
                    </label>
                </div>

                {/* Asking Clarifying Questions Option */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="clarifying-questions"
                        name="clarifying-questions"
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={clarifyingQuestionsEnabled}
                        onChange={handleClarifyingQuestionsChange}
                    />
                    <label htmlFor="clarifying-questions" className="ml-3 block text-lg font-medium text-gray-700">
                        Asking Clarifying Questions
                    </label>
                </div>
            </div>
        )
    }

    // --- NEW: Function to toggle the advanced config modal ---
    const toggleAdvancedConfig = () => {
        setShowAdvancedConfig(prev => !prev);
    };

    useEffect(() => {
        // Check if the 'isLoggedIn' flag exists in sessionStorage
        const loggedIn = sessionStorage.getItem('isLoggedIn');
        
        if (loggedIn !== 'true') {
          // If not logged in, redirect to the login page
          router.replace('/login');
        } else {
          // If logged in, allow the component to render
          setIsAuthenticated(true);
        }
      }, [router]); // Re-run if router changes
    
      const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        router.push('/login');
      };
    
      

    // Effect to update available models when selectedModelCompany changes
    useEffect(() => {
        setAvailableModels(modelOptions[selectedModelCompany] || []);
        setSelectedModels([]); // Clear selected models when company changes
    }, [selectedModelCompany]); // Depend on selectedModelCompany

    // Function to handle changes in text input fields (email, industry name)
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Removed 'query' handling as the direct input field is removed
        if (name === 'recipient_email') {
            setRecipientEmail(value);
        } else if (name === 'industry_name') {
            setIndustryName(value);
        } else if (name === 'Industry_Name') {
            setIndustry_Name(value);
        }
        // Handle other fields as needed
    };

    // Function to handle changes in the multi-select dropdown for models
    const handleSelectChange = (e) => {
        const options = Array.from(e.target.selectedOptions);
        const values = options.map(option => option.value);
        setSelectedModels(values);
    };

    // Function to handle changes in the model company dropdown
    const handleModelCompanyChange = (e) => {
        setSelectedModelCompany(e.target.value);
    };

    // Function to handle changes in the prompt rewriting checkbox
    const handlePromptRewritingChange = (e) => {
        setPromptRewritingEnabled(e.target.checked);
        if (!e.target.checked) {
            setRewrittenPrompt('');
            setShowPromptConfirmation(false);
            setFinalPromptForResearch('');
        }
    };

    // Function to handle changes in the clarifying questions checkbox
    const handleClarifyingQuestionsChange = (e) => {
        setClarifyingQuestionsEnabled(e.target.checked);
    };

    // While checking, show a loading message
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
      }
      
    // Function to initiate the research process (either directly or after prompt rewriting)
    const initiateResearch = async (promptToUse) => {

        // if (!recipientEmail || !recipientEmail.includes('@accessholdings.com')) {
        //     // If validation fails, set the error message
        //     setMessage("sorry, you are not allowed to run this process");

        //     // Set a timer to clear the message after 2 seconds
        //     setTimeout(() => {
        //         setMessage(''); // Clear the message
        //     }, 2000);

        //     // Stop the function execution
        //     return;
        // }

        setIsLoadingResearch(true);
        setMessage('Sending deep research request to backend...');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-report`, { // Replace with your actual Django backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // query: promptToUse, // Use the confirmed prompt
                    models: selectedModels,
                    recipient_email: recipientEmail,
                    industry_name: Industry_Name, // Include industry name for analysis
                    // prompt_rewriting: promptRewritingEnabled,
                    // clarifying_questions: clarifyingQuestionsEnabled, // Send new state to backend
                }),
            });

            if (response.status !== 202) {
                // Use the message from the JSON data for the error
                throw new Error(`Failed to fetch research analysis.`);
            }

            let res = await response.json();
            console.log("Full response from backend>>>", res);
            //    Check the status on the 'response' object


            // This part is now correct
            console.log("response from backend>>>", res.message);
            setMessage(res.message);
            // setResearchAnalysis(data.output_text);
            // let reasoning = [];
            // for (const item of data.output) {
            //     if (item.type === "reasoning") {
            //         reasoning.push(item.summary.map(s => s.text).join(' '));
            //         break;
            //     }
            // }
            // let search = [];
            // for (const item of data.output) {
            //     if (item.type === "web_search_call") {
            //         search.push(item.action);
            //         break;
            //     }
            // }
            // console.log("Reasoning:", reasoning);
            // console.log("Web Search Call:", search);
            // setReasoning(reasoning);
            // setWebSearchCall(search);
            // setCitations(data.citations || []);
            // setMessage('Deep research completed successfully! Analysis sent to your email.');
            // setShowPromptConfirmation(false);
            // setRewrittenPrompt('');
        } catch (error) {
            console.error('Error during research:', error);
            setMessage('An error occurred during deep research. Please try again.');
        } finally {
            setIsLoadingResearch(false);
        }
    };

    // Function to handle the initial form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setResearchAnalysis(null);
        setCitations([]);
        setMessage('');
        setRewrittenPrompt('');
        setShowPromptConfirmation(false);
        setFinalPromptForResearch('');
        // setIndustryAnalysis(null);

        // --- UPDATED: Model validation now checks if config is open ---
        if (selectedModels.length === 0) {
            setMessage('Please select at least one model from the settings.');
            // Open the settings modal if no model is selected
            setShowAdvancedConfig(true);
            return;
        }
        if (!recipientEmail.trim()) {
            setMessage('Please enter a recipient email.');
            return;
        }

        setIsLoading(true);

        if (!promptRewritingEnabled) {
            setMessage('Rewriting your prompt...');
            try {
                // The prompt for rewriting now needs to be generic or based on other inputs.
                // If industryName is available, use it as context. Otherwise, generate a general research prompt.
                handleConfirmRewrittenPrompt()

            } catch (error) {
                console.error('Error during prompt rewriting:', error);
                setMessage('An error occurred during prompt rewriting. Please try again.');
                setFinalPromptForResearch(''); // Clear final prompt on error
            } finally {
                setIsLoading(false);
            }
        } else {
            // If prompt rewriting is NOT enabled, and there's no direct query input,
            // we cannot proceed with research.
            setMessage('Please enable "Prompt Rewriting" to generate a research query, or provide a query through other means.');
            setIsLoading(false);
        }
    };

    // Function to handle industry analysis
    const handleIndustryAnalysis = async () => {
        setIsLoading(true);
        setMessage(`Analyzing the ${industryName} industry...`);
        setIndustryAnalysis(null);

        if (!industryName.trim()) {
            setMessage('Please enter an industry name for analysis.');
            setIsLoading(false);
            return;
        }

        try {
            const industryPrompt = `identify the most commonly accepted names for this ${industryName} industry.`;

            let resp = await fetch('/api/getname', { // Replace with your actual Django backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                    industryPrompt: industryPrompt
                }),
            });

            // if (!response.ok) {
            //     // Get the error message from the backend's JSON response
            //     const errorData = await response.json();
            //     throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            // }

            const response = await resp.json();
            console.log("Full response from backend>>>", response);




            //    Check the status on the 'response' object

            if (response && response.output_text) {
                try {
                    const parsedData = JSON.parse(response.output_text); // Parse the JSON string
                    console.log("Parsed Data:", parsedData);
                    if (parsedData && Array.isArray(parsedData.commonNames)) {
                        setIndustryAnalysis(parsedData.commonNames); // Set the commonNames array to state
                        setMessage(`Common names for ${industryName} retrieved.`);
                    } else {
                        setMessage(`Invalid response format for ${industryName}. Please try again.`);
                    }
                } catch (parseError) {
                    console.error("Error parsing JSON:", parseError);
                    setMessage(`Failed to parse response for ${industryName}. Please try again.`);
                }
            } else {
                setMessage(`Failed to get analysis for ${industryName}. Please try again.`);
            }
        } catch (error) {
            console.error('Error during industry analysis:', error);
            setMessage('An error occurred during industry analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    // Function to handle confirmation of the rewritten prompt
    const handleConfirmRewrittenPrompt = () => {
        // finalPromptForResearch is already set by handleSubmit
        setShowPromptConfirmation(false);
        initiateResearch(finalPromptForResearch);
    };

    // Function to handle editing the rewritten prompt (if user wants to modify it)
    const handleEditRewrittenPrompt = () => {
        setShowPromptConfirmation(false);
        // When editing, set the rewritten prompt back into the main query input for editing
        // Since there's no longer a direct query input, we set it to the rewrittenPrompt
        // and expect the user to manually copy/paste or re-trigger prompt rewriting.
        // For now, we'll just clear the rewritten prompt and message.
        setRewrittenPrompt('');
        setMessage('You can re-enable Prompt Rewriting to generate a new prompt.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-inter">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">

                {/* --- UPDATED: Logo and Settings Button --- */}
                <div className='flex justify-center mb-14'>
                    <div className="relative"> {/* Wrapper for positioning */}
                        {/* Replaced Next.js Image with standard img tag to fix build error */}
                        <img
                            src="/icon.png"
                            width="250"
                            height="250"
                            alt="NOAH Research Logo"
                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/250x250/e0e7ff/3730a3?text=NOAH'; }} // Fallback placeholder
                        />
                        {/* Settings Icon Button */}
                        <button
                            type="button"
                            onClick={toggleAdvancedConfig}
                            className="absolute -top-1 -right-45 p-2 rounded-full text-gray-500 bg-white shadow-lg border border-gray-100 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 active:scale-90 active:bg-gray-200"
                            aria-label="Open advanced settings"
                        >
                            {/* Settings Cog SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>


                </div>



                {/* Industry Analysis Input */}
                <div className="mb-6">
                    <label htmlFor="industry-name" className="block text-lg font-medium text-gray-700 mb-2">
                        Industry Name for Analysis:
                    </label>
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            id="industry-name"
                            name="industry_name"
                            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base text-black"
                            placeholder="e.g., 'Pest Control'"
                            value={industryName}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={handleIndustryAnalysis}
                            className="py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Analyze Industry'
                            )}
                        </button>
                    </div>
                </div>


                {/* Display Industry Analysis */}



                {/* Message display area */}
                {message && (
                    <div className={`p-3 mb-4 rounded-lg text-center ${isLoading || isLoadingResearch ? 'bg-blue-100 text-blue-800' : researchAnalysis || industryAnalysis ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} shadow-sm`}>
                        {message}
                    </div>
                )}

                {/* {!showPromptConfirmation ? ( */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Research Query Input (single) - REMOVED */}
                    {/* The research query will now be generated via Prompt Rewriting */}

                    {/* Model Company Selection */}
                    <div>
                        <div>
                            <label htmlFor="Industry_Name" className="block text-lg font-medium text-gray-700 mb-2">
                                Industry Name:
                            </label>
                            <select
                                id="Industry_Name"
                                name='Industry_Name'
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base text-black bg-white"
                                value={Industry_Name}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select an industry</option>
                                {industryAnalysis?.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div >

                        <div>
                            <label htmlFor="recipient_email" className="block text-lg font-medium text-gray-700 mb-2 mt-8">
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


                    </div>



                    {/* Research Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoadingResearch} // Disable if rewriting not enabled
                        >
                            {isLoadingResearch ? (
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Start Research' // Clarified button text
                            )}
                        </button>
                    </div>
                </form>


                {/* Display Research Analysis and Citations */}
                {researchAnalysis && (
                    <div className="mt-10 pt-8 border-t border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Research Analysis</h2>
                        <div className="bg-gray-50 p-6 rounded-lg shadow-inner text-gray-800 leading-relaxed text-base">
                            <p>{researchAnalysis}</p>
                        </div>

                        {citations.length > 0 && (
                            <div className="mt-8">
                                {/* Citations display area - currently commented out in your original code */}
                            </div>
                        )}

                        {reasoning.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Reasoning</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
                                    {reasoning.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {webSearchCall?.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-3">Web Search Calls</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
                                    {webSearchCall.map((item, index) => (
                                        <li key={index}>{JSON.stringify(item)}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- NEW: Conditionally render the modal --- */}
            {showAdvancedConfig && (
                <Modal title="Advanced Settings" onClose={toggleAdvancedConfig}>
                    {/* The content is generated by your existing function */}
                    {advancedmodelsConfig()}
                </Modal>
            )}

        </div>
    );
};

export default App;

