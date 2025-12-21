import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Semester } from "@/types/cgpa";
import { SemesterCard } from "./SemesterCard";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Download, GraduationCap, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function createEmptySemester(index: number): Semester {
  return {
    id: generateId(),
    name: `Semester ${index}`,
    subjects: [],
    sgpa: 0,
    totalCredits: 0,
  };
}

export function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([createEmptySemester(1)]);
  const { toast } = useToast();

  const { cgpa, totalCredits } = useMemo(() => {
    let totalWeighted = 0;
    let totalCreds = 0;

    semesters.forEach((sem) => {
      sem.subjects.forEach((sub) => {
        if (sub.credits > 0 && sub.gradePoint > 0) {
          totalWeighted += sub.credits * sub.gradePoint;
          totalCreds += sub.credits;
        }
      });
    });

    return {
      cgpa: totalCreds > 0 ? totalWeighted / totalCreds : 0,
      totalCredits: totalCreds,
    };
  }, [semesters]);

  const addSemester = useCallback(() => {
    setSemesters((prev) => [...prev, createEmptySemester(prev.length + 1)]);
  }, []);

  const updateSemester = useCallback((updated: Semester) => {
    setSemesters((prev) =>
      prev.map((sem) => (sem.id === updated.id ? updated : sem))
    );
  }, []);

  const removeSemester = useCallback((id: string) => {
    setSemesters((prev) => prev.filter((sem) => sem.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSemesters([createEmptySemester(1)]);
    toast({
      title: "Cleared",
      description: "All data has been reset.",
    });
  }, [toast]);

  const exportData = useCallback(() => {
    const data = {
      semesters,
      cgpa,
      totalCredits,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cgpa-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exported",
      description: "Your CGPA report has been downloaded.",
    });
  }, [semesters, cgpa, totalCredits, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="p-2 rounded-xl bg-primary/10 hover-scale hover-glow transition-all">
                <GraduationCap className="h-6 w-6 text-primary" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">CGPA Calculator</h1>
                <p className="text-sm text-muted-foreground">Track your academic performance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover-lift">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={clearAll} className="hover-lift">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportData} className="hover-lift">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="card-elegant rounded-xl p-6 border border-border/50 hover-glow cursor-default">
            <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
              Overall CGPA
            </div>
            <div className="text-4xl font-bold text-primary">{cgpa.toFixed(2)}</div>
            <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(cgpa / 10) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="card-elegant rounded-xl p-6 border border-border/50 hover-glow cursor-default">
            <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
              Total Credits
            </div>
            <div className="text-4xl font-bold">{totalCredits}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Across {semesters.length} semester{semesters.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Semesters */}
        <div className="space-y-4">
          {semesters.map((semester) => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              onUpdate={updateSemester}
              onRemove={removeSemester}
            />
          ))}
        </div>

        {/* Add Semester Button */}
        <Button
          onClick={addSemester}
          className="w-full mt-6 py-6 text-base font-medium btn-hover"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Semester
        </Button>

        {/* Info */}
        <div className="mt-8 p-4 rounded-xl bg-secondary/30 border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            CGPA = Σ(Credit × Grade Point) ÷ Σ(Credits) • Grade scale: S(10), A(9), B(8), C(7), D(6), E(5), F(0)
          </p>
        </div>
      </main>
    </div>
  );
}
