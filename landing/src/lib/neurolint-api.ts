export interface AnalysisResult {
  success: boolean;
  analysis?: {
    recommendedLayers: number[];
    detectedIssues: Array<{
      type: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
      fixedByLayer: number;
      line?: number;
      column?: number;
      ruleId?: string;
    }>;
    confidence: number;
    processingTime: number;
    analysisId: string;
  };
  error?: string;
}

export interface FixResult {
  success: boolean;
  transformed?: string;
  layers?: Array<{
    layerId: number;
    success: boolean;
    improvements: string[];
  }>;
  error?: string;
}

export interface LayerInfo {
  layerId: number;
  name: string;
  description: string;
}

export const neurolintAPI = {
  async analyzeCode(code: string): Promise<AnalysisResult> {
    // Mock implementation for demo
    return {
      success: true,
      analysis: {
        recommendedLayers: [1, 2, 3],
        detectedIssues: [
          {
            type: "missing-key",
            severity: "high",
            description: "Missing key prop in map iteration",
            fixedByLayer: 2,
          },
        ],
        confidence: 0.95,
        processingTime: 150,
        analysisId: "demo-" + Date.now(),
      },
    };
  },

  async fixCode(code: string, layers: number[]): Promise<FixResult> {
    // Mock implementation for demo
    return {
      success: true,
      transformed: code,
      layers: layers.map((layerId) => ({
        layerId,
        success: true,
        improvements: ["Demo improvement"],
      })),
    };
  },

  async getLayerInfo(): Promise<LayerInfo[]> {
    return [
      { layerId: 1, name: "Configuration", description: "Config fixes" },
      { layerId: 2, name: "Patterns", description: "Pattern fixes" },
      { layerId: 3, name: "Components", description: "Component fixes" },
    ];
  },
};
