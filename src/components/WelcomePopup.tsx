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
import { X } from 'lucide-react';

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
}

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    };

    checkAndShowPopup();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen(false);

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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 gap-0">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-50 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white transition-all duration-200 hover:scale-110"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-gray-700" />
        </button>

        {/* Image Section */}
        {popupData.image_url && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
            <img
              src={popupData.image_url}
              alt={popupData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content Section */}
        {(popupData.show_title || (popupData.show_content && popupData.content) || popupData.show_button) && (
          <div className="p-6 sm:p-8">
            <DialogHeader className="space-y-3 text-center">
              {popupData.show_title && (
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {popupData.title}
                </DialogTitle>
              )}
              {popupData.show_content && popupData.content && (
                <DialogDescription className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {popupData.content}
                </DialogDescription>
              )}
            </DialogHeader>

            {/* Action Button */}
            {popupData.show_button && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleButtonClick}
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {popupData.button_text}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
