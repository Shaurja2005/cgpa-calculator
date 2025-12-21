import { Subject, gradeLabels, labelToGradePoint } from "@/types/cgpa";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SubjectRowProps {
  subject: Subject;
  index: number;
  onUpdate: (id: string, field: keyof Subject, value: string | number) => void;
  onRemove: (id: string) => void;
}

export function SubjectRow({ subject, index, onUpdate, onRemove }: SubjectRowProps) {
  const handleGradeChange = (grade: string) => {
    const gradePoint = labelToGradePoint[grade as keyof typeof labelToGradePoint] ?? 0;
    onUpdate(subject.id, "grade", grade);
    onUpdate(subject.id, "gradePoint", gradePoint);
  };

  return (
    <div className="group flex items-center gap-3 py-3 px-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-fade-in">
      <span className="w-8 text-sm font-medium text-muted-foreground">{index + 1}</span>
      
      <Input
        type="text"
        placeholder="Subject name"
        value={subject.name}
        onChange={(e) => onUpdate(subject.id, "name", e.target.value)}
        className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
      />
      
      <Input
        type="number"
        placeholder="Credits"
        min={0}
        max={10}
        value={subject.credits || ""}
        onChange={(e) => onUpdate(subject.id, "credits", Number(e.target.value))}
        className="w-24 bg-background/50 border-border/50 focus:border-primary/50 transition-colors text-center"
      />
      
      <Select value={subject.grade} onValueChange={handleGradeChange}>
        <SelectTrigger className="w-24 bg-background/50 border-border/50 focus:border-primary/50">
          <SelectValue placeholder="Grade" />
        </SelectTrigger>
        <SelectContent>
          {gradeLabels.map((grade) => (
            <SelectItem key={grade} value={grade}>
              {grade} ({labelToGradePoint[grade]})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="w-16 text-center">
        <span className="text-sm font-semibold text-primary">
          {subject.gradePoint > 0 ? subject.gradePoint.toFixed(1) : "—"}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(subject.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
