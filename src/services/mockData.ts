
// Mock data generator for CX dashboard

// Industry types - now focusing more on Telecom
export const industries = [
  "Telecom",
  "Airline",
  "Hotel",
  "Retail Banking",
  "Insurance",
  "Healthcare",
  "Retail/E-commerce"
];

// Organizations by industry - Updated Telecom companies
export const organizations = {
  "Telecom": ["AT&T", "Verizon", "T-Mobile", "Comcast", "Rogers", "Bharti Airtel", "Softbank", "China Telecom", "Orange", "Telefonica", "America Movil", "Singtel", "Vodafone", "Telus", "China Mobile", "Deutsche Telekom", "American Tower"],
  "Airline": ["SkyWings", "GlobalAir", "FlightPath", "AeroElite", "BlueSky"],
  "Hotel": ["LuxStay", "ComfortInn", "GrandResort", "RetreatHotels", "UrbanLodge"],
  "Retail Banking": ["FirstBank", "MetroFinance", "CitySavings", "HeritageTrust", "CapitalOne"],
  "Insurance": ["ShieldCover", "TrustGuard", "SecureLife", "ProtectPlus", "SafeHaven"],
  "Healthcare": ["WellnessCare", "LifeClinic", "MedFirst", "HealingHands", "VitalHealth"],
  "Retail/E-commerce": ["ShopEase", "RetailGiant", "DigitalMart", "BuyNow", "TrendyGoods"]
};

// CX Dimensions
export const cxDimensions = [
  "Efficiency",
  "Convenience",
  "Personalization",
  "Trust/Confidence",
  "Emotional Connection",
  "Problem Resolution",
  "Product Quality",
  "Value Perception"
];

// Financial metrics
export const financialMetrics = [
  "Revenue Growth",
  "Profit Margin",
  "Customer Retention",
  "Customer Acquisition Cost",
  "Average Revenue Per User",
  "Market Share",
  "Brand Value"
];

// Generate random number within range
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
const randomIntInRange = (min: number, max: number) => Math.floor(randomInRange(min, max));

// Generate CX Index scores for organizations
export const generateCXIndexData = () => {
  const data: any[] = [];
  
  industries.forEach(industry => {
    organizations[industry].forEach(org => {
      // Generate a base score for the organization
      const baseScore = randomInRange(60, 95);
      
      // Add some variance to make data more realistic
      data.push({
        industry,
        organization: org,
        cxIndex: parseFloat(baseScore.toFixed(1)),
        rank: 0, // Will be calculated later
        lastYearIndex: parseFloat((baseScore - randomInRange(-8, 10)).toFixed(1)),
        isImproving: Math.random() > 0.4
      });
    });
  });
  
  // Sort by CX Index and assign ranks
  data.sort((a, b) => b.cxIndex - a.cxIndex);
  data.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  return data;
};

// Generate industry-specific factor loadings
export const generateIndustryLoadings = () => {
  const data: any[] = [];
  
  industries.forEach(industry => {
    const factorData: any = { industry };
    
    cxDimensions.forEach(dimension => {
      // Different industries have different important factors
      let baseImportance = 0.5;
      
      // Adjust importance based on industry-dimension pairs
      if ((industry === "Airline" && (dimension === "Efficiency" || dimension === "Convenience")) ||
          (industry === "Healthcare" && (dimension === "Trust/Confidence" || dimension === "Emotional Connection")) ||
          (industry === "Retail/E-commerce" && (dimension === "Convenience" || dimension === "Product Quality")) ||
          (industry === "Telecom" && (dimension === "Problem Resolution" || dimension === "Value Perception")) ||
          (industry === "Hotel" && (dimension === "Emotional Connection" || dimension === "Personalization")) ||
          (industry === "Retail Banking" && (dimension === "Trust/Confidence" || dimension === "Problem Resolution")) ||
          (industry === "Insurance" && (dimension === "Trust/Confidence" || dimension === "Value Perception"))) {
        baseImportance = 0.8;
      }
      
      factorData[dimension] = parseFloat((baseImportance + randomInRange(-0.2, 0.2)).toFixed(2));
    });
    
    data.push(factorData);
  });
  
  return data;
};

// Generate direct feedback diagnostics data
export const generateFeedbackDiagnostics = () => {
  const data: any[] = [];
  
  industries.forEach(industry => {
    organizations[industry].forEach(org => {
      const orgData: any = {
        industry,
        organization: org,
        overall: parseFloat(randomInRange(65, 95).toFixed(1))
      };
      
      cxDimensions.forEach(dimension => {
        // Base score with some variance
        let baseScore = randomInRange(60, 90);
        
        // Add some correlation with overall score
        baseScore = baseScore * 0.7 + orgData.overall * 0.3;
        
        // Adjust based on industry-dimension affinities
        if ((industry === "Airline" && dimension === "Efficiency") ||
            (industry === "Healthcare" && dimension === "Trust/Confidence") ||
            (industry === "Retail/E-commerce" && dimension === "Convenience") ||
            (industry === "Hotel" && dimension === "Emotional Connection")) {
          baseScore += randomInRange(2, 8);
        }
        
        orgData[dimension] = parseFloat(baseScore.toFixed(1));
      });
      
      data.push(orgData);
    });
  });
  
  return data;
};

// Generate experience impact scores comparing incoming and outgoing expectations
export const generateExperienceImpactScores = () => {
  const data: any[] = [];
  
  industries.forEach(industry => {
    organizations[industry].forEach(org => {
      cxDimensions.forEach(dimension => {
        // Generate incoming and outgoing expectation scores
        const incomingExpectation = randomInRange(60, 90);
        
        // Outgoing expectation is influenced by incoming but with variance
        let outgoingExpectation;
        if (Math.random() > 0.7) {
          // Sometimes experiences exceed expectations
          outgoingExpectation = incomingExpectation + randomInRange(2, 15);
        } else if (Math.random() > 0.5) {
          // Sometimes they meet expectations
          outgoingExpectation = incomingExpectation + randomInRange(-2, 2);
        } else {
          // Sometimes they fall short
          outgoingExpectation = incomingExpectation - randomInRange(2, 15);
        }
        
        data.push({
          industry,
          organization: org,
          dimension,
          incomingExpectation: parseFloat(incomingExpectation.toFixed(1)),
          outgoingExpectation: parseFloat(outgoingExpectation.toFixed(1)),
          gap: parseFloat((outgoingExpectation - incomingExpectation).toFixed(1))
        });
      });
    });
  });
  
  return data;
};

// Generate passive metrics data (web traffic, social media, reviews)
export const generatePassiveMetrics = () => {
  const data: any[] = [];
  
  industries.forEach(industry => {
    organizations[industry].forEach(org => {
      // Generate base engagement score
      const baseEngagement = randomInRange(50, 95);
      
      data.push({
        industry,
        organization: org,
        engagementIndex: parseFloat(baseEngagement.toFixed(1)),
        webTraffic: randomIntInRange(10000, 5000000),
        socialMediaFollowers: randomIntInRange(5000, 2000000),
        reviewScore: parseFloat(randomInRange(3, 4.9).toFixed(1)),
        reviewCount: randomIntInRange(500, 25000),
        storeVisits: industry.includes("Retail") ? randomIntInRange(50000, 2000000) : null,
        customerCalls: randomIntInRange(5000, 500000),
        timeOnSite: parseFloat(randomInRange(1, 10).toFixed(1))
      });
    });
  });
  
  return data;
};

// Generate correlation data between CX scores and financial metrics
export const generateCorrelationData = () => {
  const data: any[] = [];
  const cxData = generateCXIndexData();
  
  cxData.forEach(org => {
    financialMetrics.forEach(metric => {
      // Create correlation with some noise
      let financialValue;
      
      switch(metric) {
        case "Revenue Growth":
          // Revenue growth correlates with CX but with variance
          financialValue = (org.cxIndex - 70) / 10 + randomInRange(-5, 5);
          break;
        case "Profit Margin":
          financialValue = (org.cxIndex - 60) / 4 + randomInRange(-3, 5);
          break;
        case "Customer Retention":
          // Retention strongly correlates with CX
          financialValue = org.cxIndex * 0.8 + randomInRange(0, 10);
          break;
        case "Customer Acquisition Cost":
          // CAC is inversely related to CX
          financialValue = 100 - org.cxIndex * 0.5 + randomInRange(-10, 20);
          break;
        case "Average Revenue Per User":
          financialValue = org.cxIndex * 0.5 + randomInRange(-5, 25);
          break;
        case "Market Share":
          financialValue = (org.cxIndex - 60) / 2 + randomInRange(-2, 5);
          break;
        case "Brand Value":
          // Brand value strongly correlates with CX
          financialValue = org.cxIndex * 1.2 + randomInRange(-20, 20);
          break;
        default:
          financialValue = randomInRange(0, 100);
      }
      
      data.push({
        industry: org.industry,
        organization: org.organization,
        cxIndex: org.cxIndex,
        financialMetric: metric,
        value: parseFloat(financialValue.toFixed(1)),
        potential: parseFloat(randomInRange(0, 100).toFixed(1))
      });
    });
  });
  
  return data;
};

// Generate historical competitive landscape data
export const generateCompetitiveLandscape = () => {
  const years = [2019, 2020, 2021, 2022, 2023];
  const data: any[] = [];
  
  industries.forEach(industry => {
    const orgCount = organizations[industry].length;
    
    years.forEach(year => {
      // Base industry competitive intensity for the year
      let baseCompetitive = 50;
      let baseExperiential = 40;
      
      // Add yearly trends
      if (year >= 2020) {
        baseExperiential += (year - 2019) * 5; // Increasing focus on experience over time
      }
      
      // Add industry variance
      if (industry === "Retail/E-commerce" || industry === "Hotel") {
        baseExperiential += 15; // These industries are more experience-focused
      } else if (industry === "Telecom" || industry === "Insurance") {
        baseExperiential -= 10; // These tend to be more commodity-focused
      }
      
      data.push({
        industry,
        year,
        competitiveIntensity: parseFloat((baseCompetitive + randomInRange(-10, 10)).toFixed(1)),
        experientialFocus: parseFloat((baseExperiential + randomInRange(-10, 10)).toFixed(1)),
        commodityFocus: parseFloat((100 - baseExperiential + randomInRange(-10, 10)).toFixed(1)),
        organizationCount: orgCount + randomIntInRange(-1, 1)
      });
    });
  });
  
  return data;
};

// Generate financial impact projection data
export const generateFinancialImpact = () => {
  const data: any[] = [];
  const cxData = generateCXIndexData();
  
  cxData.forEach(org => {
    const baseRevGrowth = (org.cxIndex - 70) / 10 + randomInRange(-2, 3);
    const baseMarginGrowth = (org.cxIndex - 75) / 20 + randomInRange(-1, 2);
    const baseRetentionImprovement = calculateBaseRetention(org.cxIndex) + randomInRange(-0.5, 2);
    
    const scenarios = [
      {
        name: "Current Trajectory",
        cxImprovement: 0,
        revenuePct: parseFloat(baseRevGrowth.toFixed(1)),
        marginPct: parseFloat(baseMarginGrowth.toFixed(1)),
        retentionPct: parseFloat(baseRetentionImprovement.toFixed(1))
      },
      {
        name: "Moderate Improvement",
        cxImprovement: 5,
        revenuePct: parseFloat((baseRevGrowth + 2).toFixed(1)),
        marginPct: parseFloat((baseMarginGrowth + 0.8).toFixed(1)),
        retentionPct: parseFloat((baseRetentionImprovement + 3).toFixed(1))
      },
      {
        name: "Significant Improvement",
        cxImprovement: 10,
        revenuePct: parseFloat((baseRevGrowth + 4.5).toFixed(1)),
        marginPct: parseFloat((baseMarginGrowth + 1.8).toFixed(1)),
        retentionPct: parseFloat((baseRetentionImprovement + 7).toFixed(1))
      }
    ];
    
    data.push({
      industry: org.industry,
      organization: org.organization,
      currentCXIndex: org.cxIndex,
      scenarios
    });
  });
  
  return data;
};

// Function to get all data
export const getAllData = () => {
  const baseData = {
    cxIndexData: generateCXIndexData(),
    industryLoadings: generateIndustryLoadings(),
    feedbackDiagnostics: generateFeedbackDiagnostics(),
    experienceImpact: generateExperienceImpactScores(),
    passiveMetrics: generatePassiveMetrics(),
    correlationData: generateCorrelationData(),
    competitiveLandscape: generateCompetitiveLandscape(),
    financialImpact: generateFinancialImpact(),
    industries,
    organizations,
    cxDimensions,
    financialMetrics
  };
  
  // Generate AT&T specific data
  baseData.attData = {
    surveys: generateATTSurveyData(),
    passiveMetrics: generateATTPassiveMetrics()
  };
  
  // Generate historical data for each industry
  const industryHistoricalData = industries.map((industry) => {
    const years = ['2019', '2020', '2021', '2022', '2023'];
    // For telecom, create more detailed metrics
    const metrics = industry === "Telecom" 
      ? ['Revenue Growth', 'Customer Satisfaction', 'Net Promoter Score', 'Customer Churn', 'ARPU']
      : ['Revenue', 'Customer Satisfaction', 'Market Share'];
    
    return {
      industry,
      years,
      datasets: metrics.map(metric => {
        // Generate more realistic trend data
        let baseValue = 50 + Math.random() * 20;
        return {
          name: metric,
          data: years.map((year, i) => {
            // Create realistic trends based on metric
            if (metric === 'Customer Satisfaction' || metric === 'Net Promoter Score') {
              // Slight improvement over time
              baseValue += Math.random() * 5 - 1;
            } else if (metric === 'Customer Churn') {
              // Decreasing is better for churn
              baseValue -= Math.random() * 3 - 1;
            } else {
              // More variable for financial metrics
              baseValue += Math.random() * 8 - 4;
            }
            return parseFloat(baseValue.toFixed(1));
          })
        };
      })
    };
  });
  
  // Add the historical data to the base data object
  return {
    ...baseData,
    industryHistoricalData
  };
};

// Helper for more accurate correlations
const calculateBaseRetention = (cxIndex: number): number => {
  return (cxIndex - 60) / 20;
};

// Generate AT&T specific survey data
const generateATTSurveyData = () => {
  const surveyTypes = ['NPS', 'CSAT', 'CES', 'Post-Interaction'];
  const channels = ['Call Center', 'In-Store', 'Website', 'Mobile App', 'Chat Support'];
  const regions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'];
  const data = [];
  
  // Generate 50 sample surveys
  for (let i = 0; i < 50; i++) {
    const date = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000); // Last 180 days
    const surveyType = surveyTypes[Math.floor(Math.random() * surveyTypes.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    
    // Scores depend on channel and survey type
    let score;
    if (surveyType === 'NPS') {
      score = Math.floor(Math.random() * 11); // 0-10
      // Adjust scores by channel
      if (channel === 'Mobile App') score = Math.min(10, score + 2);
      if (channel === 'Call Center') score = Math.max(0, score - 1);
    } else if (surveyType === 'CSAT') {
      score = Math.floor(Math.random() * 5) + 1; // 1-5
      if (channel === 'In-Store') score = Math.min(5, score + 1);
    } else if (surveyType === 'CES') {
      score = Math.floor(Math.random() * 7) + 1; // 1-7
      if (channel === 'Chat Support') score = Math.max(1, score - 1);
    } else {
      score = Math.floor(Math.random() * 100) + 1; // 1-100
    }
    
    data.push({
      id: i + 1,
      date: date.toISOString().split('T')[0],
      surveyType,
      channel,
      region,
      score,
      comment: generateRandomComment(surveyType, score, channel)
    });
  }
  
  return data;
};

// Generate random customer comments based on context
const generateRandomComment = (surveyType: string, score: number, channel: string) => {
  const positiveComments = [
    "Great service, very helpful staff.",
    "Quick resolution to my problem.",
    "The app is very easy to use.",
    "Customer service rep was knowledgeable and friendly.",
    "Best cellular coverage in my area."
  ];
  
  const neutralComments = [
    "Service was okay, nothing special.",
    "Got what I needed, but took longer than expected.",
    "Coverage is decent in most areas.",
    "The representative was professional but not very warm.",
    "Problem got resolved but required multiple attempts."
  ];
  
  const negativeComments = [
    "Long wait times and unhelpful staff.",
    "Still having issues with my service.",
    "The app crashes frequently.",
    "Poor coverage in my neighborhood.",
    "Was on hold for over 30 minutes before getting help."
  ];
  
  let commentPool;
  if (surveyType === 'NPS') {
    if (score >= 9) commentPool = positiveComments;
    else if (score >= 7) commentPool = neutralComments;
    else commentPool = negativeComments;
  } else if (surveyType === 'CSAT') {
    if (score >= 4) commentPool = positiveComments;
    else if (score >= 3) commentPool = neutralComments;
    else commentPool = negativeComments;
  } else if (surveyType === 'CES') {
    if (score <= 2) commentPool = positiveComments;
    else if (score <= 4) commentPool = neutralComments;
    else commentPool = negativeComments;
  } else {
    if (score >= 80) commentPool = positiveComments;
    else if (score >= 60) commentPool = neutralComments;
    else commentPool = negativeComments;
  }
  
  // Add some channel-specific details
  let comment = commentPool[Math.floor(Math.random() * commentPool.length)];
  if (channel === 'Mobile App') {
    comment += " " + ["The app is intuitive.", "Would like more features in the app.", "App needs better stability."][Math.floor(Math.random() * 3)];
  } else if (channel === 'Call Center') {
    comment += " " + ["The rep was very knowledgeable.", "Had to be transferred multiple times.", "Wait time was too long."][Math.floor(Math.random() * 3)];
  } else if (channel === 'In-Store') {
    comment += " " + ["Store was clean and well-organized.", "Too busy in the store.", "Store staff seemed disinterested."][Math.floor(Math.random() * 3)];
  }
  
  return comment;
};

// Generate AT&T specific passive metrics data
const generateATTPassiveMetrics = () => {
  // Generate 12 months of passive metrics
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const metrics = [
    { name: 'Social Media Sentiment', baseline: 65 },
    { name: 'App Store Rating', baseline: 3.8 },
    { name: 'Website Visit Duration', baseline: 5.2 },
    { name: 'Call Center Volume', baseline: 142000 },
    { name: 'Support Ticket Resolution Time', baseline: 24 }
  ];
  
  // Generate data for each metric
  return metrics.map(metric => {
    return {
      name: metric.name,
      data: months.map((month, index) => {
        // Create somewhat realistic trend with some seasonality
        let value = metric.baseline;
        
        // Add seasonality effect (lower in summer months for some metrics)
        if (metric.name === 'Call Center Volume' && (month === 'Jun' || month === 'Jul')) {
          value *= 0.85;
        }
        
        // Add general improvement trend over time
        if (metric.name === 'Social Media Sentiment' || metric.name === 'App Store Rating') {
          value += index * 0.05;
        }
        
        // Add random variation
        value += (Math.random() - 0.5) * (metric.baseline * 0.1);
        
        return {
          month,
          value: parseFloat(value.toFixed(2))
        };
      })
    };
  });
};
