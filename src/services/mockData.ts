import { faker } from '@faker-js/faker';

// Types
interface CXIndexData {
  industry: string;
  organization: string;
  cxIndex: number;
  lastYearIndex: number;
  isImproving: boolean;
}

interface IndustryLoading {
  industry: string;
  loadingScore: number;
  [key: string]: string | number;
}

interface FeedbackDiagnostic {
  industry: string;
  organization: string;
  overall: number;
  [key: string]: string | number;
}

interface ExperienceImpact {
  industry: string;
  organization: string;
  metric: string;
  impactScore: number;
}

interface PassiveMetric {
  industry: string;
  metric: string;
  score: number;
}

interface CorrelationData {
  industry: string;
  dimension1: string;
  dimension2: string;
  correlation: number;
}

interface CompetitiveLandscape {
  industry: string;
  organization: string;
  metric: string;
  score: number;
  marketShare?: number;
}

interface FinancialImpact {
  industry: string;
  metric: string;
  impactScore: number;
}

// Constants
const industriesList = ["Telecom", "Banking", "Retail", "Healthcare", "Insurance", "Utilities", "Travel", "Technology"];
const cxDimensionsList = ["Efficiency", "Convenience", "Personalization", "Trust/Confidence", "Emotional Connection", "Problem Resolution", "Product Quality", "Value Perception", "Clarity of Information", "Staff Knowledge", "Follow-up Care"];
const financialMetricsList = ["Revenue Growth", "Customer Retention", "Cost Reduction", "Market Share", "Profit Margin"];

// Utility function to generate random data
const generateRandomNumber = (min: number, max: number) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
};

export const getAllData = () => {
  // Generate industry-specific data
  const industries = ["Telecom", "Banking", "Retail", "Healthcare", "Insurance", "Utilities", "Travel", "Technology"];
  
  // Organization list by industry
  const organizations: { [key: string]: string[] } = {
    "Telecom": ["AT&T", "Verizon", "T-Mobile", "Comcast", "Rogers", "Bharti Airtel", "Softbank", "China Telecom", "Orange", "Telefonica", "America Movil", "Singtel", "Vodafone", "Telus", "China Mobile", "Deutsche Telekom", "American Tower"],
    "Banking": ["JPMorgan Chase", "Bank of America", "Wells Fargo", "Citibank", "HSBC", "Barclays", "Deutsche Bank", "BNP Paribas", "UBS", "Goldman Sachs"],
    "Retail": ["Walmart", "Amazon", "Target", "Home Depot", "Costco", "Best Buy", "Kroger", "Walgreens", "CVS", "Tesco"],
    "Healthcare": ["UnitedHealth", "Anthem", "Cigna", "Humana", "Kaiser Permanente", "HCA Healthcare", "CVS Health", "Centene", "Molina Healthcare", "WellCare"],
    "Insurance": ["State Farm", "Geico", "Progressive", "Allstate", "Liberty Mutual", "Travelers", "Farmers", "Nationwide", "American Family", "USAA"],
    "Utilities": ["NextEra Energy", "Duke Energy", "Southern Company", "Dominion Energy", "Exelon", "American Electric Power", "Sempra Energy", "Xcel Energy", "WEC Energy", "Consolidated Edison"],
    "Travel": ["Marriott", "Hilton", "Hyatt", "Airbnb", "Expedia", "Booking.com", "Delta Airlines", "American Airlines", "United Airlines", "Southwest Airlines"],
    "Technology": ["Apple", "Microsoft", "Google", "Amazon", "Facebook", "Intel", "IBM", "Oracle", "Cisco", "Salesforce"]
  };

  // Generate CX Index Data
  const cxIndexData: CXIndexData[] = industries.map((industry) => {
    return organizations[industry].map((organization) => ({
      industry,
      organization,
      cxIndex: generateRandomNumber(65, 85),
      lastYearIndex: generateRandomNumber(60, 80),
      isImproving: Math.random() > 0.5
    }));
  }).reduce((acc, val) => acc.concat(val), []);

  // Generate Industry Loadings
  const industryLoadings: IndustryLoading[] = industries.map((industry) => {
    const loading: IndustryLoading = {
      industry,
      loadingScore: generateRandomNumber(50, 90)
    };
    
    cxDimensionsList.forEach(dimension => {
      loading[dimension] = generateRandomNumber(0.2, 0.9);
    });
    
    return loading;
  });

  // Generate Feedback Diagnostics
  const feedbackDiagnostics: FeedbackDiagnostic[] = industries.map((industry) => {
    return organizations[industry].map((organization) => {
      const baseScore = generateRandomNumber(60, 80);
      const diagnostic: FeedbackDiagnostic = {
        industry,
        organization,
        overall: baseScore
      };
      cxDimensionsList.forEach(dimension => {
        diagnostic[dimension] = generateRandomNumber(baseScore - 10, baseScore + 10);
      });
      return diagnostic;
    });
  }).reduce((acc, val) => acc.concat(val), []);

  // Generate Experience Impact
  const experienceImpact: ExperienceImpact[] = industries.map((industry) => {
    return organizations[industry].map((organization) => {
      return financialMetricsList.map(metric => ({
        industry,
        organization,
        metric,
        impactScore: generateRandomNumber(5, 20)
      }));
    }).reduce((acc, val) => acc.concat(val), []);
  }).reduce((acc, val) => acc.concat(val), []);

  // Generate Passive Metrics
  const passiveMetrics: PassiveMetric[] = industries.map((industry) => {
    return [
      { industry, metric: "Social Media Sentiment", score: generateRandomNumber(60, 80) },
      { industry, metric: "Online Reviews", score: generateRandomNumber(65, 85) },
      { industry, metric: "Forums & Communities", score: generateRandomNumber(55, 75) }
    ];
  }).reduce((acc, val) => acc.concat(val), []);

  // Generate Correlation Data
  const correlationData: CorrelationData[] = industries.map((industry) => {
    const dimensions = faker.helpers.shuffle([...cxDimensionsList]).slice(0, 3);
    return [
      {
        industry,
        dimension1: dimensions[0],
        dimension2: dimensions[1],
        correlation: generateRandomNumber(0.5, 0.9)
      },
      {
        industry,
        dimension1: dimensions[1],
        dimension2: dimensions[2],
        correlation: generateRandomNumber(0.3, 0.7)
      },
      {
        industry,
        dimension1: dimensions[0],
        dimension2: dimensions[2],
        correlation: generateRandomNumber(0.1, 0.5)
      }
    ];
  }).reduce((acc, val) => acc.concat(val), []);

  // Generate Competitive Landscape
  const competitiveLandscape: CompetitiveLandscape[] = industries.map((industry) => {
    return organizations[industry].map((organization) => {
      const marketShare = generateRandomNumber(1, 25);
      return ["Customer Satisfaction", "Product Quality", "Pricing", "Innovation"].map((metric) => ({
        industry,
        organization,
        metric,
        score: generateRandomNumber(60, 95),
        marketShare
      }));
    }).reduce((acc, val) => acc.concat(val), []);
  }).reduce((acc, val) => acc.concat(val), []);

  // Generate Financial Impact
  const financialImpact: FinancialImpact[] = industries.map((industry) => {
    return financialMetricsList.map(metric => ({
      industry,
      metric,
      impactScore: generateRandomNumber(5, 25)
    }));
  }).reduce((acc, val) => acc.concat(val), []);
  
  // AT&T specific data
  const attSurveys = [
    {
      surveyType: 'NPS',
      score: 8,
      date: '2023-08-12',
      channel: 'Call Center',
      region: 'Northeast',
      comment: 'The customer service rep was very helpful and resolved my billing issue quickly.'
    },
    {
      surveyType: 'CSAT',
      score: 4,
      date: '2023-08-10',
      channel: 'In-Store',
      region: 'West',
      comment: 'Great experience upgrading my device. The store staff were knowledgeable and efficient.'
    },
    {
      surveyType: 'CES',
      score: 6,
      date: '2023-08-09',
      channel: 'Website',
      region: 'South',
      comment: 'It was somewhat difficult to find the right plan for my needs on the website.'
    },
    {
      surveyType: 'NPS',
      score: 7,
      date: '2023-08-08',
      channel: 'Mobile App',
      region: 'Midwest',
      comment: 'The app is intuitive and makes it easy to check my data usage and pay my bill.'
    },
    {
      surveyType: 'CSAT',
      score: 3,
      date: '2023-08-07',
      channel: 'Call Center',
      region: 'Southeast',
      comment: 'Had to wait too long to speak to a representative, but they were helpful once connected.'
    },
    {
      surveyType: 'CES',
      score: 5,
      date: '2023-08-06',
      channel: 'Chat Support',
      region: 'Southwest',
      comment: 'The chat support agent was professional but it took several attempts to resolve my issue.'
    },
    {
      surveyType: 'NPS',
      score: 9,
      date: '2023-08-05',
      channel: 'In-Store',
      region: 'Northwest',
      comment: 'Excellent service! The rep went above and beyond to help me choose the right plan for my family.'
    }
  ];
  
  const attData = {
    surveys: attSurveys
  };
  
  return {
    cxIndexData,
    industryLoadings,
    feedbackDiagnostics,
    experienceImpact,
    passiveMetrics,
    correlationData,
    competitiveLandscape,
    financialImpact,
    industries,
    organizations,
    cxDimensions: cxDimensionsList,
    financialMetrics: financialMetricsList,
    attData
  };
};

export const generateCompetitiveLandscape = (industry: string) => {
  const data = getAllData();
  return data.competitiveLandscape.filter(item => item.industry === industry);
};
