import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, ArrowLeft, HelpCircle, AlertTriangle } from 'lucide-react';
import { fetchTest } from '../../api/tests';
import { submitTest, fetchMySubmissions } from '../../api/submissions';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { useToast } from '../../components/ui/Toast';

export default function TakeTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState(null);
  const [pastSubmission, setPastSubmission] = useState(null);

  useEffect(() => {
    Promise.all([fetchTest(testId), fetchMySubmissions()])
      .then(([t, subs]) => {
        setTest(t);
        const existing = subs.find((s) => s.test?._id === testId || s.test === testId);
        if (existing) {
          setPastSubmission(existing);
        } else {
          setAnswers(new Array(t.questions.length).fill(-1));
          setSecondsLeft(t.durationMinutes * 60);
        }
      })
      .catch(() => toast('Could not load this test', 'error'))
      .finally(() => setLoading(false));
  }, [testId]);

  const doSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const data = await submitTest(testId, answers);
      setResult(data);
      toast('Test submitted');
    } catch (err) {
      toast(err.response?.data?.message || 'Could not submit test', 'error');
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  }, [testId, answers]);

  useEffect(() => {
    if (secondsLeft === null || result || pastSubmission) return;
    if (secondsLeft <= 0) {
      doSubmit();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, result, pastSubmission, doSubmit]);

  const timeLabel = useMemo(() => {
    if (secondsLeft === null) return '';
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, [secondsLeft]);

  const timerWarning = secondsLeft !== null && secondsLeft < 300;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-campus-inkSoft">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading test…
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <HelpCircle size={32} className="text-campus-inkSoft" />
        <p className="text-campus-inkSoft">Test not found.</p>
      </div>
    );
  }

  const backButton = (
    <Button variant="ghost" size="sm" onClick={() => navigate('/student/tests')}>
      <ArrowLeft size={15} /> Back to tests
    </Button>
  );

  if (pastSubmission) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {backButton}
        <Card title={test.title}>
          <div className="mb-5 rounded-xl bg-gradient-to-r from-campus-greenSoft to-campus-green/10 px-5 py-4 text-center border border-campus-green/20">
            <div className="font-mono text-3xl font-bold text-campus-green">
              {pastSubmission.score} / {pastSubmission.totalMarks}
            </div>
            <div className="mt-1 text-sm text-campus-green">
              Score
            </div>
          </div>
          <div className="space-y-4">
            {test.questions.map((q, i) => (
              <QuestionReview key={q._id || i} index={i} question={q} />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (result) {
    const pct = Math.round((result.submission.score / result.submission.totalMarks) * 100);
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        {backButton}
        <Card title={test.title}>
          <div className={`mb-5 rounded-xl px-5 py-6 text-center border ${
            pct >= 60 ? 'bg-gradient-to-r from-campus-greenSoft to-campus-green/10 border-campus-green/20' :
            pct >= 40 ? 'bg-gradient-to-r from-campus-goldSoft to-campus-gold/10 border-campus-gold/20' :
            'bg-gradient-to-r from-campus-redSoft to-campus-red/10 border-campus-red/20'
          }`}>
            <div className={`font-mono text-4xl font-bold ${
              pct >= 60 ? 'text-campus-green' : pct >= 40 ? 'text-campus-gold' : 'text-campus-red'
            }`}>
              {result.submission.score} / {result.submission.totalMarks}
            </div>
            <div className="mt-2 text-sm text-campus-inkSoft">{pct}% score</div>
          </div>
          <div className="space-y-4">
            {result.breakdown.map((b, i) => (
              <div key={i} className="rounded-xl border border-campus-line bg-white p-4">
                <div className="flex items-start gap-3">
                  {b.correct ? (
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-campus-green" />
                  ) : (
                    <XCircle size={20} className="mt-0.5 shrink-0 text-campus-red" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-campus-ink">
                      Q{i + 1}. {b.question}
                    </p>
                    <p className="mt-1.5 text-xs text-campus-inkSoft">
                      Your answer: {' '}
                      <span className={b.correct ? 'text-campus-green font-medium' : 'text-campus-red font-medium'}>
                        {b.selected >= 0 ? test.questions[i].options[b.selected] : 'Not answered'}
                      </span>
                    </p>
                    {!b.correct && (
                      <p className="mt-0.5 text-xs text-campus-green">
                        Correct answer: {test.questions[i].options[b.correctOption]}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className={`inline-block h-1.5 flex-1 rounded-full ${
                        b.correct ? 'bg-campus-green' : 'bg-campus-red'
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Active quiz mode
  const answeredCount = answers.filter((a) => a >= 0).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header with timer */}
      <div className="flex items-center justify-between">
        {backButton}
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-sm font-bold shadow-sm ${
          timerWarning ? 'bg-campus-red text-white animate-pulse-soft' : 'bg-campus-forest text-campus-paper'
        }`}>
          <Clock size={16} />
          {timeLabel}
          {timerWarning && <AlertTriangle size={16} />}
        </div>
      </div>

      <Card title={test.title}>
        {test.description && (
          <p className="mb-4 text-sm text-campus-inkSoft bg-campus-paperDim/50 rounded-lg p-3">
            {test.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-campus-inkSoft mb-2">
            <span>Progress</span>
            <span>{answeredCount} of {test.questions.length} answered</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-campus-paperDim">
            <div
              className="h-full rounded-full bg-gradient-to-r from-campus-forest to-campus-forestLight transition-all duration-500"
              style={{ width: `${(answeredCount / test.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {test.questions.map((q, i) => (
            <div
              key={q._id || i}
              className={`rounded-xl border p-5 transition-all ${
                answers[i] >= 0
                  ? 'border-campus-forest/30 bg-campus-forest/5'
                  : 'border-campus-line bg-white/50'
              }`}
            >
              <p className="text-sm font-semibold text-campus-ink mb-3">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-campus-forest text-white text-xs mr-2">
                  {i + 1}
                </span>
                {q.text}
              </p>
              <div className="space-y-2 ml-8">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm transition border ${
                      answers[i] === oi
                        ? 'border-campus-forest bg-campus-forest/5 text-campus-forest font-medium'
                        : 'border-campus-line bg-white hover:border-campus-forest/30 hover:bg-campus-paperDim'
                    }`}
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      answers[i] === oi
                        ? 'border-campus-forest bg-campus-forest text-white'
                        : 'border-campus-line'
                    }`}>
                      {answers[i] === oi && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <input
                      type="radio"
                      name={`q-${i}`}
                      checked={answers[i] === oi}
                      onChange={() => setAnswers((a) => a.map((val, idx) => (idx === i ? oi : val)))}
                      className="sr-only"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-campus-line pt-5">
          <span className="text-xs text-campus-inkSoft">
            {test.questions.length - answeredCount} question{test.questions.length - answeredCount === 1 ? '' : 's'} remaining
          </span>
          <Button onClick={() => setConfirmOpen(true)} disabled={submitting} loading={submitting}>
            {submitting ? 'Submitting…' : 'Submit test'}
          </Button>
        </div>
      </Card>

      {confirmOpen && (
        <ConfirmDialog
          title="Submit this test?"
          message={`You've answered ${answeredCount} of ${test.questions.length} questions. Once submitted, you can't change your answers.`}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={doSubmit}
          busy={submitting}
          confirmLabel="Submit"
        />
      )}
    </div>
  );
}

function QuestionReview({ index, question }) {
  return (
    <div className="rounded-xl border border-campus-line bg-white p-4">
      <p className="text-sm font-semibold text-campus-ink mb-3">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-campus-forest text-white text-xs mr-2">
          {index + 1}
        </span>
        {question.text}
      </p>
      <div className="ml-8 space-y-2">
        {question.options.map((opt, oi) => (
          <div
            key={oi}
            className={`rounded-lg px-4 py-2 text-sm border ${
              oi === question.correctOption
                ? 'bg-campus-greenSoft text-campus-green border-campus-green/30 font-medium'
                : 'text-campus-inkSoft border-transparent'
            }`}
          >
            {oi === question.correctOption && <CheckCircle2 size={14} className="inline mr-1.5" />}
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}

