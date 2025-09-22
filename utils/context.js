export const instruction2 = `SECTION 2:
Chapter 4. Customers
- Customer Segments | List of Customer segments with: description, estimated % of total industry demand, assessment of attractiveness of segment (e.g. durable demand, high willingness to pay, fast growing, high stickiness, non-cyclical demand)
- Provider Selection Factors | Assessment of what leads customers to select one provider over another (e.g. price, service quality, relationship, convenience, brand awareness)
- Common Customer Pain Points | Assessment of common pain points customers have with existing providers
Chapter 5. Competitors
- Industry Fragmentation | Industry fragmentation analysis (including market share of top players) and consolidation trends
- Regional Considerations | Any regional nuance to business concentration and fragmentation and most attractive regions for a business to be in (e.g., growing presence of customers, supply-demand imbalance)
- Competitor Archetypes | List of competitor archetypes with: description, offerings, example players, estimated market share (if available)
- Drivers of Competitive Advantage | Key drivers of competitive advantage in this industry
- Dominant Players | Overview of dominant players in the industry (e.g., large public firms, national franchise models, dominant regional firms)
- Competitor Profiles | Profiles of ~5-10 example players across the size spectrum (from large national players to smaller regional firms) with: general profile information (name, HQ location, website, year founded), ownership information, estimated scale (based on revenue, number of employees, number of locations, etc.), products / services offered, geographic footprint, key differentiators
Chapter 6. Unit Economics
- Business Model Overview | Business model overview (if multiple business models are relevant, provide an overview of each one)
- Pricing Models | Pricing models and drivers of price (e.g. what attributes drive premium pricing)
- Unit Revenue | Typical revenue per unit (with unit defined as a single location, technician, crew, job, contract, project, etc. depending on industry)
- Unit Cost Structure | Typical cost structure (variable vs. fixed)
- Unit Margins | Typical gross margins, EBITDA margins, and cash flow conversion
- Illustrative Unit P&L | Illustrative location/unit-level P&L (if possible)
- Economies of Scale | Economies of scale (e.g. how economics change with scale)
- Capex Considerations | Capex considerations (growth, replacement, and maintenance Capex) and asset intensity (e.g., equipment costs, useful life, maintenance expenses), if applicable`;

export const instruction3 = `SECTION 3:
Chapter 7. Industry KPIs
- Financial KPIs | Table 7.1: Key financial KPIs with: description and industry benchmarks (median and best-in-class, if available)
- Commercial KPIs | Table 7.2: Key commercial KPIs with: description and industry benchmarks (median and best-in-class, if available) - include Customer Acquisition Cost (CAC) and Customer Lifetime Value (CLV) if applicable and available
- Operational KPIs | Table 7.3: Key operational KPIs with: description and industry benchmarks (median and best-in-class, if available)
Chapter 8. Value Creation Opportunities
- Benefits of Scale & Density | Benefits from scale and geographic density as a business grows organically and inorganically
- Go-to-Market Workflow & Growth Opportunities | Map of typical go-to-market workflows for businesses in this industry plus key opportunities to enhance revenue growth and customer experience
- Operational Workflow & Efficiency Opportunities | Map of typical operational workflows for businesses in this industry plus key opportunities to enhance operational efficiency and expand margins
- HR Workflow & Human Capital Opportunities | Map of typical HR workflows for businesses in this industry plus key opportunities to enhance ability to attract and develop top talent
- Tech Systems & Data | Map of typical technology systems businesses use in this industry plus key opportunities to enhance tech stack to drive automation and enhance data-driven decision making
- Other Value Creation Opportunities | Other key value creation opportunities not already discussed
Chapter 9. Institutional Activity
- M&A Activity | Overview of M&A activity in the industry (level of consolidation, PE & strategic interest)
- Precedent Transactions | Table 9.1: Precedent M&A transactions (~past 10 years) with: Date, Buyer & target, Deal description, Transaction size & valuation (if available), 3rd party advisors (banks, brokers, lawyers)
- Public Comps | Table 9.2: Relevant Public Companies with: Business description, Market cap, Total Enterprise Value (TEV), TEV/LTM Revenue, TEV/LTM EBITDA, 3Y Beta
- Major Private Equity Platforms | Table 9.3: Major private equity platforms with: description of sponsor and list of acquired companies (including date acquired, if available)
- PE Case Studies | Case Studies on 2-3 private equity platforms with platform overview, leadership profiles, investment approach (if available), recent news/activity (from past 12 months), and any indicators on overall performance/results (if available).`;

export const instruction4 = `SECTION 4:
Chapter 10. Other considerations
- Regulatory Environment | Regulatory considerations
- ESG Risks & Opportunities | ESG risks & opportunities
- Other Key Risks | Key risks (regulatory, headline, disruption, etc.) relevant to a private equity investor interested in the space
Chapter 11. Industry News
- Recent Industry News | Recent developments, major industry headlines, and trending topics (~past 6-12 months)
Chapter 12. Scorecard Evaluation
- Full Scorecard | Evaluate the industry against the criteria in attached Idea Scorecard (note that the scorecard contains 31 criteria organized into 6 categories, and each criteria can be scored on a scale of 1-4 using the answer key defined in the scorecard, with 4 being the highest score) and present evaluation as a table with: Criteria, Criteria score (from 1-4), supporting commentary
- Scorecard Summary | Calculate overall average score and average score by category (out of 4 and as a % of total score)
- Conclusion | Provide a summary of pros and cons of the industry (from an investor perspective), along with a recommendation on whether this industry is a good candidate for an Access investment
General Guidelines:
- Prioritize data: Use quantitative insights wherever possible (cite sources).
- Be concise & precise: Maximize information density; minimize wordiness.
- Use bullet points and tables where appropriate to enhance readability
- Visualize information: Include visual elements such as charts and tables where helpful & relevant
- Focus on U.S. market: Exclude data from other regions.
- Include table sources below the table, not inside the table
- Do not include any icons or emojis in the report
- Remember to present each of the 4 sections one at a time, and wait for my input before advancing to the next section.`;

export const getContext = (industryName) => {
return `Market Report for US ${industryName} Industry
You are an Industry Research Agent supporting Access Holdings (https://accessholdings.com/), a middle-market private equity firm focused on building modern, enduring businesses through a "buy and build" M&A strategy in the U.S. middle market. Your mission is to conduct factual, evidence-based research to evaluate industry segments for potential investment.  The attached Idea Scorecard outlines the key criteria we consider when assessing an industry for investment.
You are to prepare a comprehensive market report for the industry listed above, using the structure below. The report contains 12 chapters split into 4 sections.  You will present each section sequentially, then wait for my input before moving on to the next section.  Do not truncate or cut off any of the report content for any reason.  Each chapter contains multiple subheaders, and the title for each subheader is denoted before the full block ("|") on that line.
SECTION 1:
Chapter 1. Industry Overview
- Industry Description | Description of the industry
- Market Size & Growth | Market size, historic & projected market growth (10-year horizon) - as there may be several ways to estimate market size from various sources, you may list out multiple market sizes but include clear definitions on what is included and excluded from each market sizing estimate
- Relevant NAICS Codes | List of relevant NAICS codes
- Macro-Economic Indicators | List of macro-economic indicators that are relevant to this industry
- Product / Service Categories | Table 1.1: Types of products/services offered with: description, target customers, and % share of market (if available)
Chapter 2. Demand Drivers
- Durability of Demand | Evaluation of demand durability (e.g., degree to which spend is non-discretionary and difficult to delay)
- Demand Drivers & Trends | Table 2.1: Key demand drivers & trends (e.g., demographic, customer behavior, technological, socio-economic, regulatory, etc.) with: impact on demand (positive, negative, neutral), and durability of trend (short-term, medium-term, long-term)
- Recession Performance & Outlook | Recession outlook, including analysis of how industry performed during the Greats Financial Crisis and COVID (if available)
Chapter 3. Value Chain
- Industry Subsegments | List of industry subsegments with: description, estimated % of market size, attractiveness of segment to an investor (e.g. durable demand, high profitability, fast growth)
- Other Value Chain Participants | Overview of other value chain participants such as suppliers, distributors, channel partners, regulators, industry associations, businesses that provide substitute products/services, and other adjacent or related businesses/organizations and intersecting markets
- Value Distribution Across the Chain | Evaluation of how value is distributed across value chain participants
- Porters' Five Forces | Evaluation of Porter's 5 Forces: Threat of new entrants, Threat of substitution, Competitive rivalry, Supplier power, Buyer power`;
}


export const EkgReportInstruction1 = (industryName) => {return `Business Development Report for US ${industryName} Industry
You are a Business Development Agent supporting Access Holdings (https://accessholdings.com/), a middle-market private equity firm specializing in building modern, enduring businesses through a "buy and build" M&A strategy. Your goal is to accelerate our efforts to engage with a target industry, identify and build relationships with industry insiders, and identify and attract potential platform investments.  The attached Research Report contains information we have gathered so far on the industry.
You are to prepare a comprehensive business development report for the industry listed above, using the structure below. The report contains 6 chapters split into 2 sections.  You will present each section sequentially, then wait for my input before moving on to the next section.  Do not truncate or cut off any content for any reason.  Each chapter contains multiple subheaders, and the title for each subheader is denoted before the full block ("|") on that line.
SECTION 1:
1. "Want-to-Own" Starter-List
- Sample Platform Candidates | Compile a detailed list of the top ~20 businesses that could serve as potential platform investments. Focus on large, scalable, privately-held, US-based middle-market businesses within this industry.  Prioritize businesses that are founder-owned, family-owned, or management-owned (not institutionally-backed). Since financial data may be unavailable, you may use alternative indicators of size such as LinkedIn employee counts, Google review volume, number of locations, online presence, etc. to assess scale. For each company, provide: General profile (Company Name, HQ Location, website, Year Founded, Description), Indicators of Scale, Products/Services Offered, Ownership Information & Any Prior Investment Activity, Leadership (Founder/CEO/Executive team)
- Additional Privately-Held Companies | Table 1.1: Simple list of additional 20-40 privately-held businesses that could serve as potential platform investments with: Company Name & website, HQ Location, Description, and Ownership Information
- Major Franchisors | Bullet point list of major franchisors in the industry with: General profile (Company Name & website, HQ Location, Year Founded, Description), Indicators of Scale (number of franchisees & locations), Leadership (CEO/Founder), and key information from Franchise Disclosure Document (FDD) if available (typical unit revenue, EBITDA/cash flow, one-time cost, franchise fees, etc.)
2. Industry Insiders (identify key industry players who can provide insights, facilitate deal flow, and expand our network)
- Intermediaries | Table 2.1: Active M&A Advisors & Dealmakers (brokers, investment banks, boutique advisory firms, deal finders, etc.) with: Name & website, Description, Relevant individuals, List of relevant industry transactions they supported (if available)
- Thought Leaders | Table 2.2: Recognized Industry thought-leaders, experts, influencers, and other well-known figures with: Name, Description
- C-suite Executives | Table 2.3: Potential C-Suite Executives for a PE-Backed Platform with: Name, Description
3. Industry Associations: Identify key industry groups and events where we can establish relationships and increase deal visibility
- Industry Associations | Table 3.1: List of relevant Industry Associations and similar groups, with: Name & website, Description, List of current and former CEOs/leaders, and Assessment of Influence in the Industry (Does this group shape policy, drive business trends, or act as a leading voice in the space?)
- Industry Events | Table 3.2: Conferences, Networking Events, Trade Shows, and similar industry events (in the next 12 months) with: Event Name & Date, Description, Significance to the Industry.  Focus on events in the US, but include international events as well if applicable to a US audience.
- Media & Publications | Table 3.3: List of highly-regarded, industry-focused magazines, websites, YouTube channels, and other relevant media and publications with: Name, Description, website`
}

export const EkgReportInstruction2 =  `SECTION 2:
4. Conversation Topics: Topics to initiate conversations and establish thought leadership within the industry
- Trending Topics | List of trending topics and industry news that could serve as conversation-starters with operators, business owners, and other industry insiders.   Include tactical suggestions on specific open-ended questions we could use to start conversations.  Frame the questions in a polite and non-threatening manner and also to elicit the most insightful responses.
- Shareable Insights | List of insights from the attached Research Report that operators & business owners may find informative and actionable.  Include tactical suggestions on ways to share those insights during conversations with operators & business owners (framed in a polite & non-threatening manner and also to elicit the most insightful responses), in order to validate the insight and demonstrate our knowledge of the industry.
- Diligence Questions | ~30 key open-ended questions for us to ask operators & business owners in order to pressure test how attractive the industry is for investment.  Frame the questions in a polite and non-threatening manner and also to elicit the most insightful responses.  Do not include any questions related to M&A, private equity, or a potential acquisition as those conversations happen later.
- Private Equity Perception | Assessment of how business owners in this industry generally perceive Private Equity and other Sponsors, and their general outlook on M&A
- Industry Terminology | Helpful industry lingo to be aware of when talking with operators
5. Industry Deep-Dives: Deep-dive reports that business leaders/operators in this industry would find interesting and helpful (include an eye-catching title for each report)
- Top Trends Report | Write a high quality, operator-friendly, accessible, engaging, data-rich ~1000-1500 word article on the top business trends impacting this industry, along with actionable advise on how business leaders can take advantage
- Customer Trends Report | Write a high quality, operator-friendly, accessible, engaging, data-rich ~1000-1500 word article on top trends/drivers impacting customer demand and customer behavior, along with actionable advise on how business leaders can take advantage
- Technology Trends Report | Write a high quality, operator-friendly, accessible, engaging, data-rich ~1000-1500 word article on top AI and technology trends in the industry plus practical ways business leaders can implement AI and technology to accelerate growth, enhance customer experience, automate processes/drive operational efficiency, and enhance data-driven decision making
6. Customer survey
- Draft Customer Survey | Build a high quality ~30-40 question customer survey with the goal of 1) prioritizing which customer segments to target, 2) determining what a compelling, differentiated value proposition to them would be, and 3) determining best approach to capture new customers.  Number the survey questions and format the answers as bullet points underneath each question.  Focus on multiple choice and Likert scale type questions, limit open-ended free form questions.
General Guidelines:
- Prioritize data: Use quantitative insights wherever possible (cite sources).
- Be concise & precise: Maximize information density; minimize wordiness.
- Use bullet points and tables where appropriate to enhance readability
- Focus on U.S. market: Exclude data from other regions.
- Conduct comprehensive external research to inform your findings
- Remember to present each of the 2 sections one at a time, and wait for my input before advancing to the next section.`

export const CreateAudioSummaryInstruction = `Keep length to around 15min.  Podcast name should be "The Deep-dive by Noah Research"`

export const GetSourceListForEkgInstruction = `Provide a full list of sources used across all 6 chapters in the Business Development Report above. Do not include reference locations.`

export const getSourcesListInstruction = `Provide a full list of sources used across all 12 chapters in the Market Report above. Do not fabricate sources, use the actual sources cited by Deep Research above.  Do not include reference locations.`

export const MarketReportSummaryInstruction = `Summarize Market Report above into a 500-word bullet-point executive summary containing the most relevant information for a private equity investor considering an investment in this space.  Use the following sections: industry overview, demand-side attributes, supply-side attributes, and investor considerations (pros & cons/risks and investment recommendation). Be concise & precise: maximize information density; minimize wordiness.  Include data / quantitative insights as much as possible. Do not include any icons or emojis in the executive summary.`