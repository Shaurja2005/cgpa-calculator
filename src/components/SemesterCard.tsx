import { Semester, Subject, labelToGradePoint } from "@/types/cgpa";
import { SubjectRow } from "./SubjectRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useCallback } from "react";

interface SemesterCardProps {
  semester: Semester;
  onUpdate: (semester: Semester) => void;
  onRemove: (id: string) => void;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function SemesterCard({ semester, onUpdate, onRemove }: SemesterCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const addSubject = useCallback(() => {
    const newSubject: Subject = {
      id: generateId(),
      name: "",
      credits: 0,
      grade: "",
      gradePoint: 0,
    };
    onUpdate({
      ...semester,
      subjects: [...semester.subjects, newSubject],
    });
  }, [semester, onUpdate]);

  const updateSubject = useCallback(
    (id: string, field: keyof Subject, value: string | number) => {
      const updatedSubjects = semester.subjects.map((sub) =>
        sub.id === id ? { ...sub, [field]: value } : sub
      );
      
      // Recalculate SGPA
      let totalWeighted = 0;
      let totalCredits = 0;
      updatedSubjects.forEach((sub) => {
        if (sub.credits > 0 && sub.gradePoint > 0) {
          totalWeighted += sub.credits * sub.gradePoint;
          totalCredits += sub.credits;
        }
      });
      
      onUpdate({
        ...semester,
        subjects: updatedSubjects,
        sgpa: totalCredits > 0 ? totalWeighted / totalCredits : 0,
        totalCredits,
      });
    },
    [semester, onUpdate]
  );

  const removeSubject = useCallback(
    (id: string) => {
      const updatedSubjects = semester.subjects.filter((sub) => sub.id !== id);
      
      let totalWeighted = 0;
      let totalCredits = 0;
      updatedSubjects.forEach((sub) => {
        if (sub.credits > 0 && sub.gradePoint > 0) {
          totalWeighted += sub.credits * sub.gradePoint;
          totalCredits += sub.credits;
        }
      });
      
      onUpdate({
        ...semester,
        subjects: updatedSubjects,
        sgpa: totalCredits > 0 ? totalWeighted / totalCredits : 0,
        totalCredits,
      });
    },
    [semester, onUpdate]
  );

  const updateSemesterName = useCallback(
    (name: string) => {
      onUpdate({ ...semester, name });
    },
    [semester, onUpdate]
  );

  return (
    <div className="card-elegant rounded-xl border border-border/50 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-secondary/30">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md hover:bg-background/50 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <Input
            type="text"
            value={semester.name}
            onChange={(e) => updateSemesterName(e.target.value)}
            className="max-w-[200px] bg-transparent border-transparent hover:border-border focus:border-primary font-medium"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">SGPA</div>
            <div className="text-xl font-bold text-primary">{semester.sgpa.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Credits</div>
            <div className="text-lg font-semibold">{semester.totalCredits}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(semester.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subjects */}
      {isExpanded && (
        <div className="p-4 space-y-2">
          {/* Header Row */}
          <div className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <span className="w-8">#</span>
            <span className="flex-1">Subject</span>
            <span className="w-24 text-center">Credits</span>
            <span className="w-24 text-center">Grade</span>
            <span className="w-16 text-center">Points</span>
            <span className="w-10"></span>
          </div>
          
          {semester.subjects.map((subject, index) => (
            <SubjectRow
              key={subject.id}
              subject={subject}
              index={index}
              onUpdate={updateSubject}
              onRemove={removeSubject}
            />
          ))}
          
          <Button
            variant="ghost"
            onClick={addSubject}
            className="w-full mt-2 text-muted-foreground hover:text-primary hover:bg-primary/5 border border-dashed border-border/50 hover:border-primary/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      )}
    </div>
  );
}
