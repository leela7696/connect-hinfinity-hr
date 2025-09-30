import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Building, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">HR Connect</span>
            <span className="text-sm text-muted-foreground">by Hinfinity</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                >
                  Dashboard
                </Button>
                {(profile?.role === 'admin' || profile?.role === 'hr') && (
                  <Button 
                    onClick={() => navigate('/user-management')}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>User Management</span>
                  </Button>
                )}
                <Button 
                  onClick={() => navigate('/profile')}
                  variant="outline"
                >
                  Profile
                </Button>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border border-border rounded-lg mt-2">
              <Link 
                to="/" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="#features" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="#contact" 
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              {user ? (
                <div className="space-y-2 pt-2">
                  <Button 
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Dashboard
                  </Button>
                  {(profile?.role === 'admin' || profile?.role === 'hr') && (
                    <Button 
                      onClick={() => {
                        navigate('/user-management');
                        setIsOpen(false);
                      }}
                      variant="outline"
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <Users className="h-4 w-4" />
                      <span>User Management</span>
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      navigate('/profile');
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Profile
                  </Button>
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <Button 
                    onClick={() => {
                      navigate('/login');
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/signup');
                      setIsOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}