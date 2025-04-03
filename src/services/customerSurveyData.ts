
// Types for customer survey data
export interface CustomerSurvey {
  id: string;
  demographics: {
    age: number;
    gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
    income: string;
    hasRecentExperience: boolean;
  };
  experience: {
    type: 'I was researching their products/services' | 
          'I was purchasing one of their products/services' | 
          'I was using a product/service of theirs' | 
          'I was looking for assistance with one of their products/services' | 
          'Other';
    channel: 'On a phone' | 'On a tablet' | 'On a computer' | 'In-person' | 'Over the phone' | 'Other';
    ingoingExpectation: number; // 1-10 scale
    importanceOfGoodExperience: number; // 1-10 scale
    desiredElements: string[];
  };
  evaluation: {
    [key: string]: number; // Element evaluations (1-10 scale)
  };
  impact: {
    outgoingExpectation: number; // 1-10 scale
  };
  organization: string;
  industry: string;
  surveyDate: string;
}

// Generate random customer survey data
const EVALUATION_ELEMENTS = [
  'Efficiency',
  'Convenience',
  'Personalization',
  'Trust/Confidence',
  'Emotional Connection',
  'Problem Resolution',
  'Product Quality',
  'Value Perception',
  'Clarity of Information',
  'Staff Knowledge',
  'Follow-up Care'
];

const generateRandomName = (): string => {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 
                      'David', 'Susan', 'Sarah', 'Jessica', 'Karen', 'Nancy', 'Lisa', 'Margaret', 'Betty', 'Sandra',
                      'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie'];
  
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
                    'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
                    'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall'];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Function to generate random customer survey data
export const generateCustomerSurveys = (count: number, industries: string[], organizations: {[key: string]: string[]}): CustomerSurvey[] => {
  const surveys: CustomerSurvey[] = [];
  
  const experienceTypes = [
    'I was researching their products/services',
    'I was purchasing one of their products/services',
    'I was using a product/service of theirs',
    'I was looking for assistance with one of their products/services',
    'Other'
  ];
  
  const channelTypes = [
    'On a phone',
    'On a tablet', 
    'On a computer', 
    'In-person', 
    'Over the phone',
    'Other'
  ];

  for (let i = 0; i < count; i++) {
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const orgsInIndustry = organizations[industry];
    const organization = orgsInIndustry[Math.floor(Math.random() * orgsInIndustry.length)];
    
    // Generate some random desired elements
    const desiredElementsCount = Math.floor(Math.random() * 4) + 2; // 2-5 elements
    const shuffledElements = [...EVALUATION_ELEMENTS].sort(() => 0.5 - Math.random());
    const desiredElements = shuffledElements.slice(0, desiredElementsCount);
    
    // Generate evaluations
    const evaluations: {[key: string]: number} = {};
    EVALUATION_ELEMENTS.forEach(element => {
      evaluations[element] = Math.floor(Math.random() * 10) + 1; // 1-10 score
    });

    // Generate income bracket
    const incomeRanges = ['Under $25,000', '$25,000 - $49,999', '$50,000 - $74,999', '$75,000 - $99,999', '$100,000 - $149,999', '$150,000+'];
    const income = incomeRanges[Math.floor(Math.random() * incomeRanges.length)];

    // Initial expectation and final impact values
    const ingoingExpectation = Math.floor(Math.random() * 5) + 5; // 5-9
    let outgoingExpectation;
    
    // Create some correlation between experience type and outcome
    if (Math.random() > 0.7) {
      // Sometimes experience exceeds expectations
      outgoingExpectation = Math.min(ingoingExpectation + Math.floor(Math.random() * 3) + 1, 10);
    } else if (Math.random() > 0.4) {
      // Sometimes it meets expectations
      outgoingExpectation = ingoingExpectation;
    } else {
      // Sometimes it fails to meet expectations
      outgoingExpectation = Math.max(ingoingExpectation - Math.floor(Math.random() * 3) - 1, 1);
    }

    const survey: CustomerSurvey = {
      id: `CS-${(i + 1).toString().padStart(4, '0')}`,
      demographics: {
        age: Math.floor(Math.random() * 60) + 18, // 18-77
        gender: ['Male', 'Female', 'Non-binary', 'Prefer not to say'][Math.floor(Math.random() * 4)] as any,
        income: income,
        hasRecentExperience: Math.random() > 0.05, // 95% have recent experience
      },
      experience: {
        type: experienceTypes[Math.floor(Math.random() * experienceTypes.length)] as any,
        channel: channelTypes[Math.floor(Math.random() * channelTypes.length)] as any,
        ingoingExpectation: ingoingExpectation,
        importanceOfGoodExperience: Math.floor(Math.random() * 3) + 7, // 7-10
        desiredElements: desiredElements,
      },
      evaluation: evaluations,
      impact: {
        outgoingExpectation: outgoingExpectation,
      },
      organization: organization,
      industry: industry,
      surveyDate: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within last 90 days
    };

    surveys.push(survey);
  }

  return surveys;
};

// Get all survey data - increased from 300 to 400 to provide more examples
export const getCustomerSurveys = (industries: string[], organizations: {[key: string]: string[]}): CustomerSurvey[] => {
  return generateCustomerSurveys(400, industries, organizations);
};

// Calculate aggregated survey statistics
export interface SurveyStats {
  totalRespondents: number;
  ageDistribution: {range: string, count: number}[];
  genderDistribution: {gender: string, count: number}[];
  incomeDistribution: {range: string, count: number}[];
  channelDistribution: {channel: string, count: number}[];
  experienceTypeDistribution: {type: string, count: number}[];
  averageElementScores: {element: string, score: number}[];
  expectationGap: number;
}

export const calculateSurveyStats = (surveys: CustomerSurvey[]): SurveyStats => {
  // Initialize data structures for stats
  const ageGroups: {[key: string]: number} = {
    '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55-64': 0, '65+': 0
  };
  
  const genderCount: {[key: string]: number} = {};
  const incomeCount: {[key: string]: number} = {};
  const channelCount: {[key: string]: number} = {};
  const typeCount: {[key: string]: number} = {};
  const elementScores: {[key: string]: number[]} = {};
  
  let totalIngoingExpectation = 0;
  let totalOutgoingExpectation = 0;
  
  // Process each survey
  surveys.forEach(survey => {
    // Age distribution
    const age = survey.demographics.age;
    if (age < 25) ageGroups['18-24']++;
    else if (age < 35) ageGroups['25-34']++;
    else if (age < 45) ageGroups['35-44']++;
    else if (age < 55) ageGroups['45-54']++;
    else if (age < 65) ageGroups['55-64']++;
    else ageGroups['65+']++;
    
    // Gender distribution
    const gender = survey.demographics.gender;
    genderCount[gender] = (genderCount[gender] || 0) + 1;
    
    // Income distribution
    const income = survey.demographics.income;
    incomeCount[income] = (incomeCount[income] || 0) + 1;
    
    // Channel distribution
    const channel = survey.experience.channel;
    channelCount[channel] = (channelCount[channel] || 0) + 1;
    
    // Experience type distribution
    const type = survey.experience.type;
    typeCount[type] = (typeCount[type] || 0) + 1;
    
    // Element scores
    Object.entries(survey.evaluation).forEach(([element, score]) => {
      if (!elementScores[element]) elementScores[element] = [];
      elementScores[element].push(score);
    });
    
    // Expectation comparison
    totalIngoingExpectation += survey.experience.ingoingExpectation;
    totalOutgoingExpectation += survey.impact.outgoingExpectation;
  });
  
  // Convert to required format
  const ageDistribution = Object.entries(ageGroups).map(([range, count]) => ({range, count}));
  const genderDistribution = Object.entries(genderCount).map(([gender, count]) => ({gender, count}));
  const incomeDistribution = Object.entries(incomeCount).map(([range, count]) => ({range, count}));
  const channelDistribution = Object.entries(channelCount).map(([channel, count]) => ({channel, count}));
  const experienceTypeDistribution = Object.entries(typeCount).map(([type, count]) => ({type, count}));
  
  // Calculate average element scores
  const averageElementScores = Object.entries(elementScores).map(([element, scores]) => ({
    element,
    score: parseFloat((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1))
  })).sort((a, b) => b.score - a.score);
  
  // Calculate expectation gap
  const expectationGap = parseFloat(((totalOutgoingExpectation - totalIngoingExpectation) / surveys.length).toFixed(1));
  
  return {
    totalRespondents: surveys.length,
    ageDistribution,
    genderDistribution,
    incomeDistribution,
    channelDistribution,
    experienceTypeDistribution,
    averageElementScores,
    expectationGap
  };
};
