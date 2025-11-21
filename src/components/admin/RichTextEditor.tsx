import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload gambar",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[500px] p-8 sm:p-12 bg-white',
        },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          
          // Check if the dropped file is an image
          if (!file.type.startsWith('image/')) {
            toast({
              title: "Error",
              description: "Hanya file gambar yang diperbolehkan",
              variant: "destructive",
            });
            return true;
          }

          // Upload and insert image
          uploadImage(file).then((url) => {
            if (url) {
              const { schema } = view.state;
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              
              if (coordinates) {
                const node = schema.nodes.image.create({ src: url });
                const transaction = view.state.tr.insert(coordinates.pos, node);
                view.dispatch(transaction);
              }
            }
          });

          return true; // Handled the drop
        }
        return false; // Let the editor handle other drops
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.startsWith('image/')) {
            const file = items[i].getAsFile();
            if (file) {
              event.preventDefault();
              
              uploadImage(file).then((url) => {
                if (url) {
                  editor?.chain().focus().setImage({ src: url }).run();
                }
              });

              return true;
            }
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    active, 
    disabled, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    disabled?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "h-8 w-8 p-0",
        active && "bg-primary/10 text-primary"
      )}
    >
      {children}
    </Button>
  );

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Hanya file gambar yang diperbolehkan",
        variant: "destructive",
      });
      return;
    }

    const url = await uploadImage(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
      {/* Toolbar */}
      <div className="border-b border-border bg-muted/50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        {/* Text Formatting */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            active={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Link and Image */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton
            onClick={() => setShowLinkDialog(!showLinkDialog)}
            active={editor.isActive('link')}
            title="Insert Link"
          >
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
              title="Upload Image (or drag & drop into editor)"
            />
            <ToolbarButton
              onClick={() => {}}
              title="Upload Image (or drag & drop into editor)"
              disabled={uploading}
            >
              <ImageIcon className={cn("h-4 w-4", uploading && "animate-pulse")} />
            </ToolbarButton>
          </div>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Text Color */}
        <div className="flex gap-1 pl-2 border-l border-border">
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="h-8 w-12 rounded cursor-pointer"
            title="Text Color"
          />
        </div>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="p-3 border-b border-border bg-muted/20">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="link-url" className="text-xs">URL Link</Label>
              <Input
                id="link-url"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
              />
            </div>
            <Button type="button" size="sm" onClick={addLink}>
              Tambah
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative bg-muted/20 p-4 sm:p-6 md:p-8">
        <div className="max-w-[21cm] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <EditorContent 
            editor={editor} 
            className="prose-p:my-4 prose-p:leading-relaxed prose-headings:my-6 prose-headings:font-bold prose-ul:my-4 prose-ol:my-4 prose-li:my-2 prose-img:my-6 prose-img:rounded-lg prose-img:shadow-md"
          />
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Mengupload gambar...</div>
          </div>
        )}
      </div>
      <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border bg-muted/30">
        💡 Tips: Drag & drop gambar langsung ke editor atau paste dari clipboard
      </div>
    </div>
  );
};
