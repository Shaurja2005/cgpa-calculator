import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calculator, TrendingUp, Download, ArrowRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Easy Calculation",
    description: "Add subjects, enter grades, and watch your GPA calculate instantly in real-time.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your academic performance across multiple semesters with visual insights.",
  },
  {
    icon: Download,
    title: "Export Reports",
    description: "Download your complete CGPA report as JSON for record-keeping or sharing.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover-scale">
              <div className="p-2 rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold">CGPA Calc</span>
            </Link>
            
            <Link to="/calculator">
              <Button className="btn-hover">
                Open Calculator
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in hover-scale cursor-default">
            <Sparkles className="h-4 w-4" />
            Simple • Elegant • Powerful
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Calculate Your
            <span className="block text-primary mt-2">CGPA Effortlessly</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            A beautiful, minimalistic tool to track your academic performance. 
            Add semesters, enter grades, and get instant calculations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/calculator">
              <Button size="lg" className="btn-hover text-lg px-8 py-6">
                Start Calculating
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="hover-lift text-lg px-8 py-6">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Preview Card */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="card-elegant rounded-2xl border border-border/50 p-8 hover-glow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "CGPA", value: "8.75", color: "text-primary" },
                { label: "Credits", value: "156", color: "text-foreground" },
                { label: "Semesters", value: "6", color: "text-foreground" },
                { label: "Subjects", value: "42", color: "text-foreground" },
              ].map((stat, i) => (
                <div key={stat.label} className="hover-lift p-4 rounded-xl cursor-default" style={{ animationDelay: `${0.1 * i}s` }}>
                  <div className="text-sm text-muted-foreground uppercase tracking-wide mb-1">{stat.label}</div>
                  <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use CGPA Calc?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Designed with simplicity and elegance in mind. No clutter, just the tools you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="card-elegant rounded-xl border border-border/50 p-8 hover-lift animate-slide-up cursor-default"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 hover-glow transition-all">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Scale */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Grade Scale Reference</h2>
          <p className="text-muted-foreground text-lg mb-12">Standard 10-point grading system</p>
          
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {[
              { grade: "S", point: 10, color: "bg-primary text-primary-foreground" },
              { grade: "A", point: 9, color: "bg-primary/80 text-primary-foreground" },
              { grade: "B", point: 8, color: "bg-primary/60 text-primary-foreground" },
              { grade: "C", point: 7, color: "bg-secondary text-secondary-foreground" },
              { grade: "D", point: 6, color: "bg-secondary text-secondary-foreground" },
              { grade: "E", point: 5, color: "bg-muted text-muted-foreground" },
              { grade: "F", point: 0, color: "bg-destructive/20 text-destructive" },
            ].map((item) => (
              <div
                key={item.grade}
                className={`${item.color} rounded-xl p-4 hover-lift hover-scale cursor-default`}
              >
                <div className="text-2xl font-bold">{item.grade}</div>
                <div className="text-sm opacity-80">{item.point} pts</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="card-elegant rounded-2xl border border-primary/20 p-12 text-center bg-gradient-to-br from-primary/5 to-primary/10 hover-glow">
            <GraduationCap className="h-16 w-16 text-primary mx-auto mb-6 animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Track Your Grades?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Start calculating your CGPA now. It's free, fast, and beautifully simple.
            </p>
            <Link to="/calculator">
              <Button size="lg" className="btn-hover text-lg px-10 py-6">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-5 w-5" />
            <span>CGPA Calculator</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with elegance and simplicity in mind.
          </p>
        </div>
      </footer>
    </div>
  );
}
