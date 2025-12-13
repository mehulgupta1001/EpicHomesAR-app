import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RealARView from '../components/RealARView';
import { ARErrorBoundary } from '../components/ARErrorBoundary';
import { HouseSelector } from '../components/HouseSelector';
import { InfoPanel } from '../components/InfoPanel';
import { MaterialCustomizer } from '../components/MaterialCustomizer';
import { Tutorial } from '../components/Tutorial';
import { HouseType } from '../constants/houseTypes';
import { offlineManager } from '../services/OfflineManager';
import { ConstructionProgress, StorageService } from '../services/storage';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/LanguageToggle';

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
    description: "Clear and level the construction site, mark foundation points according to the house footprint",
    materials: [
      "String line",
      "Measuring tape (at least 30ft)",
      "Stakes (8-10 pieces)",
      "Lime powder for marking",
      "Level ground material if needed"
    ],
    tools: [
      "Hammer",
      "Measuring tape",
      "String line",
      "Level"
    ],
    timeEstimate: "2-3 hours",
    safetyNotes: [
      "Wear appropriate footwear",
      "Check for underground utilities before marking",
      "Ensure good lighting if working in low light"
    ]
  },
  {
    title: "Foundation Setup",
    description: "Install foundation posts and beams according to traditional construction methods",
    materials: [
      "Foundation posts (8 pieces, 4x4 hardwood)",
      "Foundation beams (4 pieces, 2x6 hardwood)",
      "Concrete mix (if using concrete footings)",
      "Gravel for drainage"
    ],
    tools: [
      "Post hole digger",
      "Level",
      "Measuring tape",
      "Hammer",
      "Saw"
    ],
    timeEstimate: "1-2 days",
    safetyNotes: [
      "Use proper lifting techniques",
      "Wear safety glasses when cutting",
      "Ensure posts are properly secured"
    ]
  },
  {
    title: "Platform Construction",
    description: "Build the raised platform structure using traditional joinery techniques",
    materials: [
      "Platform beams (2x8 hardwood)",
      "Platform joists (2x6 hardwood)",
      "Platform decking (1x6 hardwood planks)",
      "Traditional binding materials (rattan or natural fiber)"
    ],
    tools: [
      "Hammer",
      "Chisel",
      "Measuring tape",
      "Level",
      "Traditional binding tools"
    ],
    timeEstimate: "2-3 days",
    safetyNotes: [
      "Work from stable platforms",
      "Use proper binding techniques",
      "Check structural integrity regularly"
    ]
  },
  {
    title: "Wall Frame Construction",
    description: "Construct the wall frames using traditional mortise and tenon joints",
    materials: [
      "Wall posts (2x4 hardwood)",
      "Wall beams (2x6 hardwood)",
      "Wall studs (2x4 hardwood)",
      "Traditional binding materials"
    ],
    tools: [
      "Chisel",
      "Hammer",
      "Measuring tape",
      "Level",
      "Traditional joinery tools"
    ],
    timeEstimate: "3-4 days",
    safetyNotes: [
      "Use sharp, well-maintained tools",
      "Work carefully with traditional joinery",
      "Ensure proper ventilation"
    ]
  },
  {
    title: "Roof Structure",
    description: "Build the roof frame using traditional construction methods",
    materials: [
      "Roof beams (2x8 hardwood)",
      "Roof rafters (2x6 hardwood)",
      "Roof purlins (2x4 hardwood)",
      "Traditional binding materials"
    ],
    tools: [
      "Hammer",
      "Chisel",
      "Measuring tape",
      "Level",
      "Ladder or scaffolding"
    ],
    timeEstimate: "2-3 days",
    safetyNotes: [
      "Use proper fall protection",
      "Work with a partner when possible",
      "Ensure stable working platform"
    ]
  },
  {
    title: "Wall Installation",
    description: "Install wall panels using traditional materials and methods",
    materials: [
      "Bamboo panels or traditional wall materials",
      "Traditional binding materials",
      "Natural insulation materials"
    ],
    tools: [
      "Hammer",
      "Traditional binding tools",
      "Measuring tape",
      "Level"
    ],
    timeEstimate: "2-3 days",
    safetyNotes: [
      "Handle materials carefully",
      "Use proper binding techniques",
      "Ensure good ventilation"
    ]
  },
  {
    title: "Roofing Installation",
    description: "Install traditional roofing materials (Nipah palm or similar)",
    materials: [
      "Nipah palm leaves or traditional roofing material",
      "Traditional binding materials",
      "Roof ridge materials"
    ],
    tools: [
      "Traditional roofing tools",
      "Ladder or scaffolding",
      "Binding materials"
    ],
    timeEstimate: "2-3 days",
    safetyNotes: [
      "Use proper fall protection",
      "Work carefully on roof",
      "Ensure stable working platform"
    ]
  },
  {
    title: "Interior Finishing",
    description: "Complete interior finishing with traditional materials and methods",
    materials: [
      "Interior wall materials",
      "Floor finishing materials",
      "Traditional decorative elements"
    ],
    tools: [
      "Traditional finishing tools",
      "Measuring tape",
      "Level"
    ],
    timeEstimate: "3-4 days",
    safetyNotes: [
      "Use appropriate finishing materials",
      "Ensure good ventilation",
      "Work carefully with decorative elements"
    ]
  }
];

interface ARScreenProps {
  selectedHouse: HouseType;
  onBack: () => void;
}

export const ARScreen: React.FC<ARScreenProps> = ({ selectedHouse, onBack }) => {
  const { t } = useLanguage();
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
  const [selectedHouseType, setSelectedHouseType] = useState<HouseType>(selectedHouse);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, string>>({});
  const [showMaterialCustomizer, setShowMaterialCustomizer] = useState(false);
  const [showHouseSelector, setShowHouseSelector] = useState(false);

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

  // Auto-dismiss AR Controls info after 5 seconds
  useEffect(() => {
    if (showRotationControls && !isPlacingHouse) {
      const timer = setTimeout(() => {
        setShowRotationControls(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showRotationControls, isPlacingHouse]);

  const handleMeasurementsUpdate = (newMeasurements: Measurements) => {
    setMeasurements(newMeasurements);
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 45);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 45);
  };

  const handleMaterialChange = (categoryId: string, materialId: string) => {
    setSelectedMaterials(prev => ({
      ...prev,
      [categoryId]: materialId
    }));
  };

  const handleOpenMaterialCustomizer = () => {
    setShowMaterialCustomizer(true);
  };

  const handleCloseMaterialCustomizer = () => {
    setShowMaterialCustomizer(false);
  };

  const viewRef = useRef<View>(null);

  const handleShare = async () => {
    // Simplified sharing for Pure RN
    Alert.alert(
      'Share Feature',
      'Sharing functionality would be implemented here in a production app.',
      [{ text: 'OK' }]
    );
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
              <Text style={styles.navButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.stepCount}>{`${currentStep + 1} ${t('of')} ${CONSTRUCTION_STEPS.length}`}</Text>
            <TouchableOpacity 
              style={[styles.navButton, currentStep === CONSTRUCTION_STEPS.length - 1 && styles.navButtonDisabled]}
              onPress={() => setCurrentStep(prev => Math.min(CONSTRUCTION_STEPS.length - 1, prev + 1))}
              disabled={currentStep === CONSTRUCTION_STEPS.length - 1}
            >
              <Text style={styles.navButtonText}>›</Text>
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
              <Text style={[styles.statusText, stepProgress?.completed && styles.statusTextCompleted]}>
                {stepProgress?.completed ? "✓ Completed" : "○ Mark as Complete"}
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
          
          <Text style={styles.sectionTitle}>{t('materials_needed')}:</Text>
          {step.materials.map((material, index) => (
            <Text key={`material-${index}`} style={styles.listItem}>• {material}</Text>
          ))}
          
          <Text style={styles.sectionTitle}>{t('tools_required')}:</Text>
          {step.tools.map((tool, index) => (
            <Text key={`tool-${index}`} style={styles.listItem}>• {tool}</Text>
          ))}
          
          <Text style={styles.sectionTitle}>{t('estimated_time')}:</Text>
          <Text style={styles.timeEstimate}>{step.timeEstimate}</Text>
          
          <Text style={styles.sectionTitle}>{t('safety_notes')}:</Text>
          {step.safetyNotes.map((note, index) => (
            <Text key={`safety-${index}`} style={styles.safetyNote}>⚠️ {note}</Text>
          ))}

          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>{t('notes')}:</Text>
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
      <LanguageToggle />
      {/* REAL AR Implementation - Uses ARCore for actual surface detection and 3D rendering */}
      <ARErrorBoundary>
        <RealARView
          selectedHouse={selectedHouseType}
          onPlacementComplete={handlePlacementComplete}
          onHousePlaced={() => {
            console.log('Epic Homes house placed in AR!');
          }}
          onError={(error) => {
            console.error('AR Error:', error);
            Alert.alert(t('ar_error'), `${t('ar_error_message')}: ${error}`);
          }}
        />
      </ARErrorBoundary>

      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowHouseSelector(!showHouseSelector)}
        >
          <Text style={styles.iconButtonText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowInfo(true)}
        >
          <Text style={styles.iconButtonText}>ℹ️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowMeasurements(!showMeasurements)}
        >
          <Text style={styles.iconButtonText}>📏</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleOpenMaterialCustomizer}
        >
          <Text style={styles.iconButtonText}>🎨</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowConstructionGuide(!showConstructionGuide)}
        >
          <Text style={styles.iconButtonText}>🔨</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <Text style={styles.iconButtonText}>📤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Text style={styles.iconButtonText}>←</Text>
        </TouchableOpacity>
      </View>


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

      {/* Material Customizer */}
      {showMaterialCustomizer && (
        <MaterialCustomizer
          onClose={handleCloseMaterialCustomizer}
          onMaterialChange={handleMaterialChange}
          selectedMaterials={selectedMaterials}
          selectedHouse={selectedHouseType}
        />
      )}

      {/* House Selector */}
      {showHouseSelector && (
        <HouseSelector
          onSelect={(house) => {
            setSelectedHouseType(house);
            setShowHouseSelector(false);
          }}
          selectedHouseId={selectedHouseType.id}
        />
      )}

      {/* AR Controls Info - Rotation/Scale are handled by touch gestures */}
      {showRotationControls && !isPlacingHouse && (
        <View style={styles.arControls}>
          <View style={styles.controlInfo}>
            <Text style={styles.controlInfoText}>🎮 AR Controls:</Text>
            <Text style={styles.controlInfoSubtext}>• Swipe on model to rotate</Text>
            <Text style={styles.controlInfoSubtext}>• Pinch to scale</Text>
            <Text style={styles.controlInfoSubtext}>• Tap to place model</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  iconButtonText: {
    color: 'white',
    fontSize: 20,
  },
  measurementsOverlay: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 15,
    zIndex: 1000,
  },
  measurementText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  constructionGuide: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1000,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
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
    backgroundColor: '#ff821e',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  navButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepCount: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff821e',
    borderRadius: 2,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  stepStatus: {
    marginBottom: 20,
  },
  statusButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  statusButtonCompleted: {
    backgroundColor: 'rgba(0,255,0,0.2)',
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#00ff00',
  },
  dateText: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 5,
  },
  stepDescription: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ff821e',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  listItem: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 10,
  },
  timeEstimate: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  arControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 130, 30, 0.9)',
    borderRadius: 30,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  controlLabel: {
    color: 'white',
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  controlCenter: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 25,
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  controlInfoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  controlInfoSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  safetyNote: {
    color: '#ffcc00',
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 10,
  },
  notesSection: {
    marginTop: 20,
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  houseSelectorOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 1000,
  },
});