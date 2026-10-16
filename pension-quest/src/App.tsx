import React, { useState, useEffect } from 'react';
import { Screen, MapViewMode, AnswerChoiceId } from './types/game';
import { CHAPTERS_DATA } from './data/chapters';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { StoryScreen } from './components/StoryScreen';
import { DocumentScreen } from './components/DocumentScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { EnquiryTaskScreen } from './components/EnquiryTaskScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { JournalScreen } from './components/JournalScreen';
import { DisclaimerModal } from './components/DisclaimerModal';
import { RestartConfirmModal } from './components/RestartConfirmModal';

const STORAGE_KEYS = {
  COMPLETED: 'pensionquest_completed_v1',
  JOURNAL: 'pensionquest_journal_v1'
};

function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
  } catch (e) {
    console.warn(`Could not read localStorage key "${key}":`, e);
  }
  return fallback;
}

function safeSetStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Could not write to localStorage key "${key}":`, e);
  }
}

function safeRemoveStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Could not remove localStorage key "${key}":`, e);
  }
}

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [activeChapterId, setActiveChapterId] = useState<string>('ch1');
  const [selectedAnswerId, setSelectedAnswerId] = useState<AnswerChoiceId | null>(null);
  const [selectedEnquiryIds, setSelectedEnquiryIds] = useState<string[]>([]);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(() =>
    safeGetStorage<string[]>(STORAGE_KEYS.COMPLETED, [])
  );
  const [unlockedJournalChapterIds, setUnlockedJournalChapterIds] = useState<string[]>(() =>
    safeGetStorage<string[]>(STORAGE_KEYS.JOURNAL, [])
  );
  const [showDisclaimerModal, setShowDisclaimerModal] = useState<boolean>(false);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);

  const activeChapter = CHAPTERS_DATA.find((c) => c.id === activeChapterId) || CHAPTERS_DATA[0];

  // Sync to local storage
  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.COMPLETED, completedChapterIds);
  }, [completedChapterIds]);

  useEffect(() => {
    safeSetStorage(STORAGE_KEYS.JOURNAL, unlockedJournalChapterIds);
  }, [unlockedJournalChapterIds]);

  const handleStartStory = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setSelectedAnswerId(null);
    setSelectedEnquiryIds([]);
    setCurrentScreen('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToDocument = () => {
    setCurrentScreen('document');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToQuestion = () => {
    setSelectedAnswerId(null);
    setCurrentScreen('question');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectChoice = (choiceId: AnswerChoiceId) => {
    setSelectedAnswerId(choiceId);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerId) {
      setCurrentScreen('feedback');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetryQuestion = () => {
    setSelectedAnswerId(null);
    setCurrentScreen('question');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToEnquiryTask = () => {
    setCurrentScreen('enquiry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleEnquiry = (id: string) => {
    setSelectedEnquiryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCompleteChapter = () => {
    if (!completedChapterIds.includes(activeChapter.id)) {
      setCompletedChapterIds((prev) => [...prev, activeChapter.id]);
    }
    if (!unlockedJournalChapterIds.includes(activeChapter.id)) {
      setUnlockedJournalChapterIds((prev) => [...prev, activeChapter.id]);
    }
    setCurrentScreen('completion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplayChapter = () => {
    setSelectedAnswerId(null);
    setSelectedEnquiryIds([]);
    setCurrentScreen('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmRestart = () => {
    safeRemoveStorage(STORAGE_KEYS.COMPLETED);
    safeRemoveStorage(STORAGE_KEYS.JOURNAL);
    setCompletedChapterIds([]);
    setUnlockedJournalChapterIds([]);
    setSelectedAnswerId(null);
    setSelectedEnquiryIds([]);
    setActiveChapterId('ch1');
    setShowRestartModal(false);
    setCurrentScreen('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unlockedJournalCount={unlockedJournalChapterIds.length}
        onOpenDisclaimer={() => setShowDisclaimerModal(true)}
        onOpenRestartModal={() => setShowRestartModal(true)}
      />

      {/* Main Content Area */}
      <main className="main-content" id="main-content">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            chapters={CHAPTERS_DATA}
            completedChapterIds={completedChapterIds}
            onStartStory={handleStartStory}
            onOpenJournal={() => setCurrentScreen('journal')}
            unlockedJournalCount={unlockedJournalChapterIds.length}
            onOpenSafeguards={() => setShowDisclaimerModal(true)}
          />
        )}

        {currentScreen === 'story' && (
          <StoryScreen
            chapter={activeChapter}
            onProceedToDocument={handleProceedToDocument}
            onBackToHome={() => setCurrentScreen('welcome')}
          />
        )}

        {currentScreen === 'document' && (
          <DocumentScreen
            chapter={activeChapter}
            onProceedToQuestion={handleProceedToQuestion}
            onBackToStory={() => setCurrentScreen('story')}
          />
        )}

        {currentScreen === 'question' && (
          <QuestionScreen
            chapter={activeChapter}
            selectedChoiceId={selectedAnswerId}
            onSelectChoice={handleSelectChoice}
            onSubmitAnswer={handleSubmitAnswer}
            onBackToDocument={() => setCurrentScreen('document')}
          />
        )}

        {currentScreen === 'feedback' && selectedAnswerId && (
          <FeedbackScreen
            chapter={activeChapter}
            selectedAnswerId={selectedAnswerId}
            onRetry={handleRetryQuestion}
            onProceedToEnquiryTask={handleProceedToEnquiryTask}
          />
        )}

        {currentScreen === 'enquiry' && (
          <EnquiryTaskScreen
            chapter={activeChapter}
            selectedEnquiryIds={selectedEnquiryIds}
            onToggleEnquiry={handleToggleEnquiry}
            onCompleteChapter={handleCompleteChapter}
            onBackToFeedback={() => setCurrentScreen('feedback')}
          />
        )}

        {currentScreen === 'completion' && (
          <CompletionScreen
            chapter={activeChapter}
            onOpenJournal={() => setCurrentScreen('journal')}
            onBackToHome={() => setCurrentScreen('welcome')}
            onReplayChapter={handleReplayChapter}
          />
        )}

        {currentScreen === 'journal' && (
          <JournalScreen
            chapters={CHAPTERS_DATA}
            unlockedChapterIds={unlockedJournalChapterIds}
            onBackToHome={() => setCurrentScreen('welcome')}
            onSelectChapter={handleStartStory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <p>
            <strong>PensionQuest Prototype</strong> — Independent educational game about UK workplace defined contribution pensions.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-navy-muted)' }}>
            Not affiliated with Prudential, M&G, or any employer. Contains draft educational content for review. For official guidance, visit MoneyHelper.
          </p>
        </div>
      </footer>

      {/* About & Safeguards Modal */}
      <DisclaimerModal
        isOpen={showDisclaimerModal}
        onClose={() => setShowDisclaimerModal(false)}
      />

      {/* Restart Confirmation Modal */}
      <RestartConfirmModal
        isOpen={showRestartModal}
        onConfirm={handleConfirmRestart}
        onCancel={() => setShowRestartModal(false)}
      />
    </div>
  );
};

export default App;
