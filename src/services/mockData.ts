
// Mock data generator for CX dashboard

// Industry types
export const industries = [
  "Airline",
  "Hotel",
  "Retail Banking",
  "Insurance",
  "Healthcare",
  "Telecom",
  "Retail/E-commerce"
];

// Organizations by industry
export const organizations = {
  "Airline": ["SkyWings", "GlobalAir", "FlightPath", "AeroElite", "BlueSky"],
  "Hotel": ["LuxStay", "ComfortInn", "GrandResort", "RetreatHotels", "UrbanLodge"],
  "Retail Banking": ["FirstBank", "MetroFinance", "CitySavings", "HeritageTrust", "CapitalOne"],
  "Insurance": ["ShieldCover", "TrustGuard", "SecureLife", "ProtectPlus", "SafeHaven"],
  "Healthcare": ["WellnessCare", "LifeClinic", "MedFirst", "HealingHands", "VitalHealth"],
  "Telecom": ["ConnectNow", "DataLink", "SignalPlus", "CommSphere", "TechWave"],
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
    const baseRetentionImprovement = (org.cxIndex - 65) / 15 + randomInRange(-0.5, 2);
    
    const scenarios = [
      {
        name: "Current Trajectory",
        cxImprovement: 0,
        revenuePct: parseFloat(baseRevGrowth.toFixed(1)),
        marginPct: parseFloat(baseMarginGrowth.toFixed(1)),
        retentionPct: parseFloat(baseRetentionGrowth.toFixed(1))
      },
      {
        name: "Moderate Improvement",
        cxImprovement: 5,
        revenuePct: parseFloat((baseRevGrowth + 2).toFixed(1)),
        marginPct: parseFloat((baseMarginGrowth + 0.8).toFixed(1)),
        retentionPct: parseFloat((baseRetentionGrowth + 3).toFixed(1))
      },
      {
        name: "Significant Improvement",
        cxImprovement: 10,
        revenuePct: parseFloat((baseRevGrowth + 4.5).toFixed(1)),
        marginPct: parseFloat((baseMarginGrowth + 1.8).toFixed(1)),
        retentionPct: parseFloat((baseRetentionGrowth + 7).toFixed(1))
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
  return {
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
};

// Helper for more accurate correlations
const baseRetentionGrowth = (cxIndex: number) => {
  return (cxIndex - 60) / 20;
};
