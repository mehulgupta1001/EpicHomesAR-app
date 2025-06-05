import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { ARView } from '../components/ARView';
import { InfoPanel } from '../components/InfoPanel';
import { Tutorial } from '../components/Tutorial';
import { offlineManager } from '../services/OfflineManager';
import { ConstructionProgress, StorageService } from '../services/storage';

interface Measurements {
  width: number;
  length: number;
  height: number;
  platformHeight: number;
}

interface StepProgress {
  completed: boolean;
  notes: string;
  startDate?: Date;
  completionDate?: Date;
}

interface ConstructionStep {
  title: string;
  description: string;
  materials: string[];
  tools: string[];
  timeEstimate: string;
  safetyNotes: string[];
  progress?: StepProgress;
}

const CONSTRUCTION_STEPS: ConstructionStep[] = [
  {
    title: "Site Preparation",
    description: "Clear and level the construction site, mark foundation points according to the 25' x 20' house footprint",
    materials: [
      "String line",
      "Measuring tape (at least 30ft)",
      "Stakes (8-10 pieces)",
      "Lime powder for marking",
      "Level ground material if needed"
    ],
    tools: [
      "Shovel",
      "Spirit level",
      "Hammer",
      "Rake",
      "Wheelbarrow"
    ],
    timeEstimate: "2-3 hours",
    safetyNotes: [
      "Check for underground utilities before digging",
      "Wear safety boots and gloves",
      "Ensure proper drainage around the site"
    ]
  },
  {
    title: "Foundation Posts",
    description: "Install main support posts for the raised platform. Posts should be buried at least 2 feet deep and extend 4 feet above ground",
    materials: [
      "Hardwood posts (8 pieces, 8ft length each)",
      "Concrete mix (2 bags per post)",
      "Gravel for post holes",
      "Water for concrete",
      "Waterproof sealant for post bases"
    ],
    tools: [
      "Post hole digger",
      "Spirit level",
      "Measuring tape",
      "Concrete mixing tray",
      "Shovel",
      "Plumb bob"
    ],
    timeEstimate: "1-2 days",
    safetyNotes: [
      "Ensure proper post depth (minimum 2ft)",
      "Use safety gloves and boots",
      "Keep concrete mix away from skin",
      "Work in pairs when handling heavy posts"
    ]
  },
  {
    title: "Platform Beams",
    description: "Install main support beams connecting the foundation posts, ensuring perfect level for the platform",
    materials: [
      "Hardwood beams (4 pieces, 25ft for length, 4 pieces 20ft for width)",
      "Galvanized bolts and nuts",
      "Metal brackets",
      "Wood preservative",
      "Traditional joinery pegs"
    ],
    tools: [
      "Wrench set",
      "Spirit level",
      "Measuring tape",
      "Power drill",
      "Traditional wood chisel set",
      "Mallet"
    ],
    timeEstimate: "2-3 days",
    safetyNotes: [
      "Use proper lifting techniques",
      "Wear safety harness when working at height",
      "Ensure secure footing on temporary platforms",
      "Use proper eye protection when drilling"
    ]
  },
  {
    title: "Floor Joists",
    description: "Install floor joists and cross bracing to support the floor boards",
    materials: [
      "Floor joists (12-15 pieces)",
      "Cross bracing timber",
      "Galvanized nails",
      "Wood preservative",
      "Joist hangers"
    ],
    tools: [
      "Hammer",
      "Measuring tape",
      "Saw",
      "Spirit level",
      "String line",
      "Marking pencil"
    ],
    timeEstimate: "1-2 days",
    safetyNotes: [
      "Maintain proper spacing between workers",
      "Wear safety glasses when cutting wood",
      "Keep tools organized to prevent tripping",
      "Use cut-resistant gloves"
    ]
  },
  {
    title: "Floor Installation",
    description: "Install bamboo or wooden floor boards, ensuring tight fit and proper alignment",
    materials: [
      "Bamboo/wooden floor boards",
      "Galvanized nails",
      "Wood sealant",
      "Gap filling compound",
      "Traditional binding material"
    ],
    tools: [
      "Hammer",
      "Measuring tape",
      "Saw",
      "Chisel set",
      "Mallets",
      "Spacing blocks"
    ],
    timeEstimate: "2-3 days",
    safetyNotes: [
      "Use knee pads when working on floor",
      "Wear appropriate footwear",
      "Keep work area clean of debris",
      "Use proper cutting techniques"
    ]
  },
  {
    title: "Wall Frame Construction",
    description: "Erect the main wall frames, including door and window openings",
    materials: [
      "Vertical posts for walls",
      "Horizontal beams",
      "Door and window frames",
      "Traditional joining materials",
      "Wood preservative"
    ],
    tools: [
      "Traditional carpentry tools",
      "Measuring tape",
      "Spirit level",
      "Plumb bob",
      "Marking tools",
      "Rope for alignment"
    ],
    timeEstimate: "3-4 days",
    safetyNotes: [
      "Work in teams when raising frames",
      "Use temporary bracing",
      "Ensure proper ladder placement",
      "Keep communication clear between team members"
    ]
  },
  {
    title: "Roof Structure",
    description: "Construct the traditional pitched roof structure with proper overhang for rain protection",
    materials: [
      "Roof beams and rafters",
      "Ridge beam",
      "Roof battens",
      "Traditional joining materials",
      "Temporary support poles"
    ],
    tools: [
      "Traditional carpentry tools",
      "Measuring tape",
      "Spirit level",
      "Rope",
      "Pulleys for lifting",
      "Safety harnesses"
    ],
    timeEstimate: "3-4 days",
    safetyNotes: [
      "Always use safety harness at height",
      "Check weather conditions before work",
      "Ensure proper scaffold setup",
      "Keep tools secured when working at height"
    ]
  },
  {
    title: "Roofing Installation",
    description: "Install traditional palm leaf roofing in overlapping layers for waterproofing",
    materials: [
      "Nipah palm leaves (prepared)",
      "Bamboo battens",
      "Natural fiber rope",
      "Additional waterproofing material",
      "Ridge capping material"
    ],
    tools: [
      "Traditional binding tools",
      "Scissors/cutting tools",
      "Measuring tape",
      "Safety ropes",
      "Bamboo poles for lifting"
    ],
    timeEstimate: "2-3 days",
    safetyNotes: [
      "Use safety harness when on roof",
      "Work in cooler hours",
      "Ensure proper ventilation",
      "Keep materials secured against wind"
    ]
  },
  {
    title: "Wall Cladding",
    description: "Install traditional bamboo or wooden wall cladding with proper overlapping",
    materials: [
      "Prepared bamboo/wood panels",
      "Traditional fasteners",
      "Natural fiber rope",
      "Sealant for joints",
      "Decorative elements"
    ],
    tools: [
      "Traditional carpentry tools",
      "Measuring tape",
      "Level",
      "Cutting tools",
      "Binding tools"
    ],
    timeEstimate: "3-4 days",
    safetyNotes: [
      "Use proper cutting techniques",
      "Wear gloves when handling bamboo",
      "Maintain clean work area",
      "Use proper lifting techniques"
    ]
  },
  {
    title: "Finishing",
    description: "Complete all finishing touches including traditional decorative elements and final weatherproofing",
    materials: [
      "Traditional decorative elements",
      "Natural wood finish",
      "Weather sealant",
      "Traditional binding materials",
      "Local craft materials"
    ],
    tools: [
      "Fine carpentry tools",
      "Application brushes",
      "Traditional crafting tools",
      "Cleaning equipment",
      "Inspection tools"
    ],
    timeEstimate: "2-3 days",
    safetyNotes: [
      "Ensure proper ventilation when using sealants",
      "Wear appropriate PPE for finishes",
      "Keep work area clean",
      "Follow traditional safety practices"
    ]
  }
];

interface ARViewProps {
  onPlacementComplete: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onMeasurementsUpdate: (measurements: Measurements) => void;
  rotation: number;
}

export const ARScreen: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [isPlacingHouse, setIsPlacingHouse] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [showRotationControls, setShowRotationControls] = useState(false);
  const [showConstructionGuide, setShowConstructionGuide] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [progress, setProgress] = useState<ConstructionProgress[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    loadSavedProgress();
    initializeOfflineMode();
  }, []);

  const loadSavedProgress = async () => {
    const savedProgress = await StorageService.loadProgress();
    if (savedProgress) {
      setProgress(savedProgress);
    }
  };

  const handleStepComplete = async (stepIndex: number, completed: boolean) => {
    const updatedProgress = [...progress];
    const now = new Date().toISOString();
    
    // Find or create progress entry
    const existingProgress = updatedProgress.find(p => p.stepIndex === stepIndex);
    if (existingProgress) {
      existingProgress.completed = completed;
      if (completed && !existingProgress.completionDate) {
        existingProgress.completionDate = now;
      }
    } else {
      updatedProgress.push({
        stepIndex,
        completed,
        notes: '',
        startDate: now,
        completionDate: completed ? now : undefined,
      });
    }
    
    setProgress(updatedProgress);
    await StorageService.saveProgress(updatedProgress);
  };

  const handleUpdateNotes = async (stepIndex: number, notes: string) => {
    const updatedProgress = [...progress];
    const existingProgress = updatedProgress.find(p => p.stepIndex === stepIndex);
    
    if (existingProgress) {
      existingProgress.notes = notes;
    } else {
      updatedProgress.push({
        stepIndex,
        completed: false,
        notes,
        startDate: new Date().toISOString(),
      });
    }
    
    setProgress(updatedProgress);
    await StorageService.saveProgress(updatedProgress);
  };

  const initializeOfflineMode = async () => {
    try {
      await offlineManager.initialize();
    } catch (error) {
      console.error('Error initializing offline mode:', error);
      Alert.alert(
        'Offline Mode Error',
        'Failed to initialize offline mode. Some features may not work without internet connection.'
      );
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  // Enhanced info for the traditional house
  const houseInfo = {
    title: 'Traditional Orang Asli House',
    description: 'This authentic Malaysian indigenous house design embodies the cultural heritage and sustainable living practices of the Orang Asli community. The design prioritizes harmony with nature, utilizing local materials and traditional building techniques.',
    significance: 'This house design represents generations of architectural wisdom, incorporating sustainable building practices and local materials. It showcases the Orang Asli\'s deep understanding of environmental adaptation and community living.',
    region: 'Central Malaysia, particularly in rural and forest regions',
  };

  const technicalInfo = {
    dimensions: measurements 
      ? `${measurements.width.toFixed(2)}m x ${measurements.length.toFixed(2)}m, Height: ${measurements.height.toFixed(2)}m`
      : '6.1m x 7.62m base, 4.57m height',
    materials: [
      'Local hardwood (Cengal or Meranti) for main structure',
      'Treated bamboo for walls and flooring',
      'Hand-woven rattan for binding and decorative elements',
      'Nipah palm leaves for traditional roofing',
      'Natural fiber ropes for traditional joinery'
    ],
    constructionTime: '2-3 months with traditional methods',
    specialFeatures: [
      'Raised platform (1.22m height) for flood protection',
      'Natural cross-ventilation system',
      'Sustainable and locally-sourced materials',
      'Traditional mortise and tenon joinery',
      'Modular design for easy maintenance',
      'Rain water collection system integration',
      'Optimal sun orientation design'
    ],
  };

  const handlePlacementComplete = () => {
    setIsPlacingHouse(false);
    setShowRotationControls(true);
    Alert.alert(
      'House Placed Successfully',
      'You can now:\n- Rotate the house using controls\n- View measurements\n- Access construction guide\n- View detailed information',
      [{ text: 'OK' }]
    );
  };

  const handleMeasurementsUpdate = (newMeasurements: Measurements) => {
    setMeasurements(newMeasurements);
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 45);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 45);
  };

  const viewRef = useRef<View>(null);

  const handleShare = async () => {
    if (!viewRef.current) return;
    
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share Your Epic Homes AR View',
        UTI: 'public.png'
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Sharing Error', 'Failed to share the image. Please try again.');
    }
  };

  const calculateOverallProgress = () => {
    const completedSteps = progress.filter(p => p.completed).length;
    return Math.round((completedSteps / CONSTRUCTION_STEPS.length) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderConstructionGuide = () => {
    if (!showConstructionGuide) return null;

    const step = CONSTRUCTION_STEPS[currentStep];
    const stepProgress = progress.find(p => p.stepIndex === currentStep);
    const overallProgress = calculateOverallProgress();

    return (
      <View style={styles.constructionGuide}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepTitle}>{`Step ${currentStep + 1}: ${step.title}`}</Text>
          <View style={styles.stepNavigation}>
            <TouchableOpacity 
              style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
              onPress={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              <MaterialIcons name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.stepCount}>{`${currentStep + 1}/${CONSTRUCTION_STEPS.length}`}</Text>
            <TouchableOpacity 
              style={[styles.navButton, currentStep === CONSTRUCTION_STEPS.length - 1 && styles.navButtonDisabled]}
              onPress={() => setCurrentStep(prev => Math.min(CONSTRUCTION_STEPS.length - 1, prev + 1))}
              disabled={currentStep === CONSTRUCTION_STEPS.length - 1}
            >
              <MaterialIcons name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${overallProgress}%` }]} />
          <Text style={styles.progressText}>{`Overall Progress: ${overallProgress}%`}</Text>
        </View>

        <ScrollView style={styles.stepContent}>
          <View style={styles.stepStatus}>
            <TouchableOpacity
              style={[styles.statusButton, stepProgress?.completed && styles.statusButtonCompleted]}
              onPress={() => handleStepComplete(currentStep, !stepProgress?.completed)}
            >
              <MaterialIcons 
                name={stepProgress?.completed ? "check-circle" : "radio-button-unchecked"} 
                size={24} 
                color={stepProgress?.completed ? "#00ff00" : "white"} 
              />
              <Text style={[styles.statusText, stepProgress?.completed && styles.statusTextCompleted]}>
                {stepProgress?.completed ? "Completed" : "Mark as Complete"}
              </Text>
            </TouchableOpacity>
            {stepProgress?.startDate && (
              <Text style={styles.dateText}>
                Started: {formatDate(stepProgress.startDate)}
              </Text>
            )}
            {stepProgress?.completionDate && (
              <Text style={styles.dateText}>
                Completed: {formatDate(stepProgress.completionDate)}
              </Text>
            )}
          </View>

          <Text style={styles.stepDescription}>{step.description}</Text>
          
          <Text style={styles.sectionTitle}>Materials Needed:</Text>
          {step.materials.map((material, index) => (
            <Text key={`material-${index}`} style={styles.listItem}>• {material}</Text>
          ))}
          
          <Text style={styles.sectionTitle}>Tools Required:</Text>
          {step.tools.map((tool, index) => (
            <Text key={`tool-${index}`} style={styles.listItem}>• {tool}</Text>
          ))}
          
          <Text style={styles.sectionTitle}>Estimated Time:</Text>
          <Text style={styles.timeEstimate}>{step.timeEstimate}</Text>
          
          <Text style={styles.sectionTitle}>Safety Notes:</Text>
          {step.safetyNotes.map((note, index) => (
            <Text key={`safety-${index}`} style={styles.safetyNote}>⚠️ {note}</Text>
          ))}

          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Progress Notes:</Text>
            <TextInput
              style={styles.notesInput}
              multiline
              placeholder="Add notes about this step..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={stepProgress?.notes}
              onChangeText={(text) => handleUpdateNotes(currentStep, text)}
            />
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container} ref={viewRef}>
      <ARView
        onPlacementComplete={handlePlacementComplete}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onMeasurementsUpdate={handleMeasurementsUpdate}
        rotation={rotation}
      />

      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowInfo(true)}
        >
          <MaterialIcons name="info" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowMeasurements(!showMeasurements)}
        >
          <MaterialIcons name="straighten" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowConstructionGuide(!showConstructionGuide)}
        >
          <MaterialIcons name="build" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <MaterialIcons name="share" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Rotation Controls */}
      {showRotationControls && !isPlacingHouse && (
        <View style={styles.rotationControls}>
          <TouchableOpacity style={styles.rotateButton} onPress={handleRotateLeft}>
            <MaterialIcons name="rotate-left" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.rotationDisplay}>
            <Text style={styles.rotationText}>{rotation}°</Text>
          </View>
          <TouchableOpacity style={styles.rotateButton} onPress={handleRotateRight}>
            <MaterialIcons name="rotate-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Measurements Overlay */}
      {showMeasurements && !isPlacingHouse && measurements && (
        <View style={styles.measurementsOverlay}>
          <Text style={styles.measurementText}>Width: {measurements.width.toFixed(2)}m</Text>
          <Text style={styles.measurementText}>Length: {measurements.length.toFixed(2)}m</Text>
          <Text style={styles.measurementText}>Height: {measurements.height.toFixed(2)}m</Text>
          <Text style={styles.measurementText}>Platform Height: {measurements.platformHeight.toFixed(2)}m</Text>
        </View>
      )}

      {/* Construction Guide */}
      {renderConstructionGuide()}

      {/* Info Panel */}
      <InfoPanel
        culturalInfo={houseInfo}
        technicalInfo={technicalInfo}
        onClose={() => setShowInfo(false)}
        visible={showInfo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topBar: {
    position: 'absolute',
    top: 40,
    right: 16,
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  rotationControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  rotationDisplay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  rotationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  measurementsOverlay: {
    position: 'absolute',
    top: 100,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 8,
  },
  measurementText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 4,
    fontWeight: '500',
  },
  constructionGuide: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 12,
    padding: 16,
    maxHeight: '40%',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  stepNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  stepCount: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 8,
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    color: 'white',
    fontSize: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#00ff00',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  listItem: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 4,
  },
  timeEstimate: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  safetyNote: {
    color: '#ffcc00',
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 4,
  },
  progressBar: {
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#00ff00',
    borderRadius: 10,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  stepStatus: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  statusButtonCompleted: {
    backgroundColor: 'rgba(0,255,0,0.1)',
  },
  statusText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  statusTextCompleted: {
    color: '#00ff00',
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 8,
  },
  notesSection: {
    marginTop: 16,
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
  },
}); 