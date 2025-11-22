import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { demoScenarios, type DemoScenario } from '../data/staticDemoData';

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set());

  const handleOpenDemo = (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    setHasAnalyzed(false);
    setExpandedLayers(new Set());
    setIsOpen(true);
  };

  const handleAnalyze = () => {
    setHasAnalyzed(true);
  };

  const toggleLayer = (layerId: number) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId);
    } else {
      newExpanded.add(layerId);
    }
    setExpandedLayers(newExpanded);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-white';
      case 'medium': return 'text-zinc-300';
      case 'low': return 'text-zinc-400';
      default: return 'text-zinc-400';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white">
          See NeuroLint in Action
        </h2>
        <p className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto font-medium">
          Choose a scenario below to see how NeuroLint detects and fixes common React issues
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {demoScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl relative border-2 border-black transition-all duration-300 hover:bg-white/8 group cursor-pointer shadow-lg hover:shadow-xl"
            onClick={() => handleOpenDemo(scenario)}
          >
            <h3 className="text-2xl font-black text-white mb-4">
              {scenario.title}
            </h3>
            <p className="text-zinc-300 leading-relaxed font-medium mb-6">
              {scenario.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                {scenario.issues.length} issues detected
              </span>
              <button className="px-4 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm">
                Try Demo
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && selectedScenario && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border-2 border-white/20 rounded-3xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div>
                <h3 className="text-2xl font-black text-white">
                  {selectedScenario.title}
                </h3>
                <p className="text-zinc-300 mt-1">
                  {selectedScenario.description}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!hasAnalyzed ? (
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-black">
                    <h4 className="text-lg font-black text-white mb-4">Sample Code</h4>
                    <pre className="bg-black/60 rounded-2xl p-4 overflow-x-auto border-2 border-white/20">
                      <code className="text-sm text-green-400 font-mono">
                        {selectedScenario.beforeCode}
                      </code>
                    </pre>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleAnalyze}
                      className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all duration-300 text-lg shadow-2xl hover:scale-105 flex items-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Analyze Code
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white/5 border-2 border-white/20 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-xl">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-green-400 font-black mb-1">Analysis Complete</h4>
                      <p className="text-zinc-300">
                        Found {selectedScenario.issues.length} issues across{' '}
                        {selectedScenario.layerBreakdown.length} layer(s)
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-white" />
                        Before (Issues Detected)
                      </h4>
                      <div className="bg-black/60 border-2 border-white/20 rounded-2xl p-4 h-[400px] overflow-y-auto backdrop-blur-xl">
                        <pre className="text-sm text-green-400 font-mono">
                          <code>{selectedScenario.beforeCode}</code>
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        After (Fixed)
                      </h4>
                      <div className="bg-black/60 border-2 border-white/20 rounded-2xl p-4 h-[400px] overflow-y-auto backdrop-blur-xl">
                        <pre className="text-sm text-green-400 font-mono">
                          <code>{selectedScenario.afterCode}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-black">
                    <h4 className="text-lg font-black text-white mb-4">Issues Detected</h4>
                    <div className="space-y-3">
                      {selectedScenario.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className="bg-black/60 border-2 border-white/20 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-xl"
                        >
                          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getSeverityColor(issue.severity)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-black ${getSeverityColor(issue.severity)}`}>
                                {issue.severity.toUpperCase()}
                              </span>
                              <span className="text-xs text-zinc-500">•</span>
                              <span className="text-xs text-zinc-500">{issue.type}</span>
                            </div>
                            <p className="text-zinc-300">{issue.description}</p>
                            <p className="text-xs text-zinc-500 mt-1">
                              Fixed by Layer {issue.fixedByLayer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border-2 border-black">
                    <h4 className="text-lg font-black text-white mb-4">Layer Breakdown</h4>
                    <div className="space-y-3">
                      {selectedScenario.layerBreakdown.map((layer) => (
                        <div key={layer.layerId} className="bg-black/60 border-2 border-white/20 rounded-2xl overflow-hidden backdrop-blur-xl">
                          <button
                            onClick={() => toggleLayer(layer.layerId)}
                            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-black">
                                {layer.layerId}
                              </div>
                              <div className="text-left">
                                <h5 className="text-white font-black">{layer.name}</h5>
                                <p className="text-sm text-zinc-400">
                                  {layer.issuesFound} issue{layer.issuesFound !== 1 ? 's' : ''} fixed
                                </p>
                              </div>
                            </div>
                            {expandedLayers.has(layer.layerId) ? (
                              <ChevronUp className="w-5 h-5 text-zinc-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-zinc-400" />
                            )}
                          </button>
                          {expandedLayers.has(layer.layerId) && (
                            <div className="p-4 border-t border-white/20 bg-black/80">
                              <h6 className="text-sm font-black text-zinc-300 mb-2">Applied Fixes:</h6>
                              <ul className="space-y-2">
                                {layer.fixes.map((fix, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    {fix}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
