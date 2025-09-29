import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Building,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Streamline employee onboarding, profile management, and organizational structure with ease."
    },
    {
      icon: Calendar,
      title: "Leave Management", 
      description: "Simplified leave requests, approvals, and tracking with automated workflows."
    },
    {
      icon: DollarSign,
      title: "Payroll Integration",
      description: "Seamless payroll processing with automated calculations and compliance tracking."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Data-driven insights into employee performance and organizational metrics."
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security with role-based access control and audit trails."
    },
    {
      icon: Clock,
      title: "Time Tracking",
      description: "Accurate time and attendance tracking with flexible scheduling options."
    }
  ];

  const benefits = [
    "Reduce administrative overhead by 60%",
    "Improve employee satisfaction scores",
    "Ensure 100% compliance with labor laws",
    "Real-time analytics and reporting",
    "Mobile-first responsive design",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
              <Building className="w-4 h-4 mr-2" />
              Trusted by Hinfinity
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Streamline HR
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Operations</span>
              <br />at Hinfinity
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Complete HR management solution designed for modern workplaces. 
              Manage employees, track performance, and boost productivity with our integrated platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Button 
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-8 py-4 text-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-8 py-4 text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="px-8 py-4 text-lg"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>

            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-primary mr-2" />
                No Setup Fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-primary mr-2" />
                Free Migration
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-primary mr-2" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need for
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> HR Excellence</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive tools designed to transform your HR operations and employee experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border border-border/50">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Why Choose HR Connect
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Transform your
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> HR Operations</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join hundreds of companies that have revolutionized their HR processes with our comprehensive platform.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                    <span className="text-foreground text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-card/80 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">98%</div>
                    <div className="text-muted-foreground">User Satisfaction</div>
                  </div>
                  <div className="bg-card/80 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">60%</div>
                    <div className="text-muted-foreground">Time Saved</div>
                  </div>
                  <div className="bg-card/80 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-muted-foreground">Companies</div>
                  </div>
                  <div className="bg-card/80 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-muted-foreground">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              About Hinfinity
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built by HR experts,
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> for HR professionals</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Hinfinity has been at the forefront of HR innovation for over a decade. Our team of experts 
              understands the unique challenges faced by modern HR departments and has built HR Connect 
              to address these needs with cutting-edge technology and intuitive design.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Enterprise Ready</h3>
                <p className="text-muted-foreground">Scalable solutions for companies of all sizes</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Compliant</h3>
                <p className="text-muted-foreground">Industry-leading security and compliance standards</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Data-Driven</h3>
                <p className="text-muted-foreground">Actionable insights to drive business decisions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">
              Contact Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to get
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> started?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Contact our team to learn how HR Connect can transform your organization.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Phone Support</h3>
              <p className="text-muted-foreground mb-4">Speak with our experts</p>
              <p className="text-primary font-medium">+1 (555) 123-4567</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">Get help via email</p>
              <p className="text-primary font-medium">support@hinfinity.com</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Office Location</h3>
              <p className="text-muted-foreground mb-4">Visit our headquarters</p>
              <p className="text-primary font-medium">San Francisco, CA</p>
            </Card>
          </div>

          <div className="text-center mt-12">
            {!user && (
              <Button 
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-8 py-4 text-lg"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">HR Connect</span>
              </div>
              <p className="text-muted-foreground">
                Streamlining HR operations for modern businesses.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 Hinfinity. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}