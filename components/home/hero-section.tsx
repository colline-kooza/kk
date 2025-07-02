import { ArrowRight } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { RainbowButton } from "@/components/magicui/rainbow-button";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import SmallTitle from "./small-title";
import { Button } from '../ui/button';
import { RainbowButton } from '../magicui/rainbow-button';

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-primary/8 md:pt-[8%] pt-[30%] mb-9">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] opacity-90"
          )}
        />
      </div>

      {/* Decorative Side Text */}
      <div className="absolute md:-left-[12%] left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-center hidden lg:block">
        <span className="text-[6rem] font-bold text-transparent bg-gradient-to-r from-primary/20 to-primary/5 bg-clip-text stroke-primary/10 select-none">
          EDUCATION
        </span>
      </div>
      
      <div className="absolute md:-right-[12%] right-0 top-1/2 -translate-y-1/2 rotate-90 origin-center hidden lg:block">
        <span className="text-[6rem] font-bold text-transparent bg-gradient-to-r from-primary/20 to-primary/5 bg-clip-text stroke-primary/10 select-none">
          INNOVATION
        </span>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8 relative z-10 ">
        <SmallTitle title="Welcome to Lectify" />

        <div className="relative">
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl md:text-4xl lg:text-4xl max-w-5xl mx-auto bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent md:leading-snug">
           Complete Multi School Management 
           <br />
           Solution
          </h1>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl -z-10" />
        </div>

        <p className="mx-auto max-w-[700px] text-muted-foreground text-base sm:text-base leading-relaxed">
          From admissions to academics, simplify every aspect of school
          administration with our comprehensive and user-friendly platform.
        </p>

        <div className="flex md:gap-4 gap-1.5 justify-center items-center pt-4">
          <RainbowButton className="h-12 px-8 font-medium text-sm whitespace-nowrap" link="/dashboard">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </RainbowButton>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="h-12 px-8 text-sm font-medium border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
          >
            See All Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 md:grid-cols-3 md:gap-6 gap-3 pt-12 max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="font-semibold text-sm">Student Management</h3>
            <p className="text-xs text-muted-foreground text-center">Complete student lifecycle management</p>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold text-sm">Academic Excellence</h3>
            <p className="text-xs text-muted-foreground text-center">Advanced grading and assessment tools</p>
          </div>
          
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-sm">Smart Analytics</h3>
            <p className="text-xs text-muted-foreground text-center">Data-driven insights and reporting</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
