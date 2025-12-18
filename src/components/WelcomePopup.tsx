import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Rocket } from 'lucide-react';

interface PopupSettings {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  button_text: string;
  button_link: string | null;
  is_enabled: boolean;
  show_button: boolean;
  button_type: 'link' | 'form';
  show_title: boolean;
  show_content: boolean;
  show_image: boolean;
}



export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [popupData, setPopupData] = useState<PopupSettings | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndShowPopup = async () => {
      // Fetch popup settings from Supabase
      const { data, error } = await supabase
        .from('popup_settings' as any)
        .select('*')
        .eq('is_enabled', true)
        .single();

      if (error || !data) {
        return;
      }

      setPopupData(data as unknown as PopupSettings);
      setIsOpen(true);
      setShowFloatingButton(false); // Reset floating button when popup opens
    };

    checkAndShowPopup();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Show floating button after popup is closed
    if (popupData?.show_button) {
      setShowFloatingButton(true);
    }
  };

  const handleButtonClick = () => {
    setIsOpen(false);
    setShowFloatingButton(false); // Hide floating button after click

    if (popupData?.button_link) {
      // Check if it's an external link
      if (popupData.button_link.startsWith('http') || popupData.button_link.startsWith('//')) {
        window.location.href = popupData.button_link;
      } else {
        // Use react-router for internal links to avoid full reload
        navigate(popupData.button_link);
      }
    }
  };

  if (!popupData) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent hideClose className="max-w-2xl p-0 overflow-visible border-0 gap-0 bg-transparent shadow-none">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="hidden sm:block absolute -top-10 -right-4 z-50 p-0 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Section */}
          {popupData.show_image && popupData.image_url && (
            <div className="relative w-[90%] mx-auto sm:w-full bg-background rounded-lg overflow-hidden">
              <img
                src={popupData.image_url}
                alt={popupData.title}
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {/* Action Button - attached to bottom of dialog */}
          {popupData.show_button && isOpen && (
            <div className="absolute -bottom-10 sm:-bottom-20 left-0 right-0 flex justify-center z-50">
              <Button
                onClick={handleButtonClick}
                size="lg"
                className="h-auto px-4 py-2 sm:px-6 sm:py-4 text-xs sm:text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-1.5 sm:gap-2"
              >
                <Rocket className="w-3 h-3 sm:w-5 sm:h-5 animate-pulse" />
                {popupData.button_text}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Button - appears on the right after popup is closed */}
      {showFloatingButton && popupData.show_button && (
        <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[9999] animate-in slide-in-from-right duration-500">
          <Button
            onClick={handleButtonClick}
            size="lg"
            className="h-auto px-4 py-2 sm:px-6 sm:py-6 text-xs sm:text-base font-semibold bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-full flex items-center gap-1.5 sm:gap-2"
          >
            <Rocket className="w-3 h-3 sm:w-5 sm:h-5" />
            {popupData.button_text}
          </Button>
        </div>
      )}
    </>
  );
};
