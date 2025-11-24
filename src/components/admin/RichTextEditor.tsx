import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Extension } from '@tiptap/core';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Link2, Image as ImageIcon, Undo, Redo, ChevronsUpDown, Indent, Outdent, Heading1, Heading2, Heading3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Custom line height extension
const LineHeightExtension = Extension.create({
  name: 'lineHeight',
  addGlobalAttributes() {
    return [{
      types: ['paragraph', 'heading'],
      attributes: {
        lineHeight: {
          default: null,
          parseHTML: element => element.style.lineHeight || null,
          renderHTML: attributes => {
            if (!attributes.lineHeight) {
              return {};
            }
            return {
              style: `line-height: ${attributes.lineHeight}`
            };
          }
        }
      }
    }];
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => ({
        commands
      }) => {
        return commands.updateAttributes('paragraph', {
          lineHeight
        });
      }
    };
  }
});
interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}
export const RichTextEditor = ({
  content,
  onChange,
  placeholder
}: RichTextEditorProps) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentLineHeight, setCurrentLineHeight] = useState('1.75');
  const {
    toast
  } = useToast();
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const {
        error: uploadError,
        data
      } = await supabase.storage.from('uploads').upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from('uploads').getPublicUrl(filePath);
      return publicUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupload gambar",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };
  const editor = useEditor({
    extensions: [StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false
      }
    }), Underline, TextStyle, Color, LineHeightExtension, TextAlign.configure({
      types: ['heading', 'paragraph']
    }), Link.configure({
      openOnClick: false
    }), Image.configure({
      inline: true
    })],
    content,
    onUpdate: ({
      editor
    }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-xs sm:prose-sm md:prose-base max-w-none focus:outline-none min-h-[500px] p-4 sm:p-8 md:p-12 bg-white [&_p]:leading-relaxed [&_p]:mb-4 cursor-text caret-primary [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-3 [&_li]:ml-0 [&_li]:leading-relaxed text-sm md:text-base'
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];

          // Check if the dropped file is an image
          if (!file.type.startsWith('image/')) {
            toast({
              title: "Error",
              description: "Hanya file gambar yang diperbolehkan",
              variant: "destructive"
            });
            return true;
          }

          // Upload and insert image
          uploadImage(file).then(url => {
            if (url) {
              const {
                schema
              } = view.state;
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY
              });
              if (coordinates) {
                const node = schema.nodes.image.create({
                  src: url
                });
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
              uploadImage(file).then(url => {
                if (url) {
                  editor?.chain().focus().setImage({
                    src: url
                  }).run();
                }
              });
              return true;
            }
          }
        }
        return false;
      }
    }
  });

  // Update editor content when content prop changes (for edit mode)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

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
  }) => <Button type="button" variant="ghost" size="sm" onClick={onClick} disabled={disabled} title={title} className={cn("h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors", active && "bg-primary/10 text-primary")}>
      {children}
    </Button>;
  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({
        href: linkUrl
      }).run();
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
        variant: "destructive"
      });
      return;
    }
    const url = await uploadImage(file);
    if (url) {
      editor.chain().focus().setImage({
        src: url
      }).run();
    }
  };
  return <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
      {/* Toolbar */}
      <div className="border-b border-border bg-muted/50 px-2 py-1.5 flex flex-wrap gap-1 sticky top-0 z-10 shadow-sm">
        {/* Text Formatting */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)">
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({
          textAlign: 'left'
        })} title="Align Left">
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({
          textAlign: 'center'
        })} title="Align Center">
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({
          textAlign: 'right'
        })} title="Align Right">
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({
          textAlign: 'justify'
        })} title="Justify">
            <AlignJustify className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({
          level: 1
        }).run()} active={editor.isActive('heading', {
          level: 1
        })} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({
          level: 2
        }).run()} active={editor.isActive('heading', {
          level: 2
        })} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({
          level: 3
        }).run()} active={editor.isActive('heading', {
          level: 3
        })} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Indent Controls */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton onClick={() => editor.chain().focus().liftListItem('listItem').run()} disabled={!editor.can().liftListItem('listItem')} title="Outdent (Shift+Tab)">
            <Outdent className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().sinkListItem('listItem').run()} disabled={!editor.can().sinkListItem('listItem')} title="Indent (Tab)">
            <Indent className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Link and Image */}
        <div className="flex gap-1 pr-2 border-r border-border">
          <ToolbarButton onClick={() => setShowLinkDialog(!showLinkDialog)} active={editor.isActive('link')} title="Insert Link">
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          <div className="relative">
            <input type="file" accept="image/*" onChange={handleImageFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} title="Upload Image (or drag & drop into editor)" />
            <ToolbarButton onClick={() => {}} title="Upload Image (or drag & drop into editor)" disabled={uploading}>
              <ImageIcon className={cn("h-4 w-4", uploading && "animate-pulse")} />
            </ToolbarButton>
          </div>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Line Height */}
        <div className="flex gap-1 pl-2 border-l border-border items-center">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Jarak Baris:</span>
          <Select value={currentLineHeight} onValueChange={value => {
          setCurrentLineHeight(value);
          editor.chain().focus().setLineHeight(value).run();
        }}>
            <SelectTrigger className="h-8 w-[72px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1.0</SelectItem>
              <SelectItem value="1.15">1.15</SelectItem>
              <SelectItem value="1.5">1.5</SelectItem>
              <SelectItem value="1.75">1.75</SelectItem>
              <SelectItem value="2">2.0</SelectItem>
              <SelectItem value="2.5">2.5</SelectItem>
              <SelectItem value="3">3.0</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Paragraph Spacing */}
        

        {/* Text Color */}
        <div className="flex gap-1 pl-2 border-l border-border">
          <input type="color" onChange={e => editor.chain().focus().setColor(e.target.value).run()} value={editor.getAttributes('textStyle').color || '#000000'} className="h-8 w-12 rounded cursor-pointer" title="Text Color" />
        </div>
      </div>

      {/* Ruler */}
      <div className="bg-white border-b-2 border-gray-300 overflow-hidden">
        <div className="max-w-[21cm] mx-auto relative h-7 bg-gradient-to-b from-gray-100 to-gray-50 border-x border-gray-200">
          <div className="absolute inset-0 flex items-end px-8">
            {/* Ruler markings */}
            {Array.from({
            length: 21
          }).map((_, i) => {
            const isMajor = i % 5 === 0;
            return <div key={i} className="flex-1 relative">
                  {/* Major tick marks (every 5cm) */}
                  {isMajor && <>
                      <div className="absolute bottom-0 left-0 w-0.5 h-4 bg-gray-600" />
                      <div className="absolute bottom-4 left-0 text-[10px] font-medium text-gray-700 -translate-x-1/2">
                        {i}
                      </div>
                    </>}
                  {/* Minor tick marks (every 1cm) */}
                  {!isMajor && <div className="absolute bottom-0 left-0 w-px h-2.5 bg-gray-400" />}
                </div>;
          })}
          </div>
        </div>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && <div className="p-3 border-b border-border bg-muted/20">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="link-url" className="text-xs">URL Link</Label>
              <Input id="link-url" type="url" placeholder="https://example.com" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLink()} />
            </div>
            <Button type="button" size="sm" onClick={addLink}>
              Tambah
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
              Batal
            </Button>
          </div>
        </div>}

      {/* Editor Content */}
      <div className="relative bg-muted/20 p-3 sm:p-4 md:p-6">
        <div className="max-w-[21cm] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <EditorContent editor={editor} className="prose-p:my-3 prose-headings:mt-6 prose-headings:mb-3 prose-headings:font-bold prose-ul:my-3 prose-ul:space-y-1.5 prose-ul:list-disc prose-ul:ml-6 prose-ol:my-3 prose-ol:space-y-1.5 prose-ol:list-decimal prose-ol:ml-6 prose-li:leading-relaxed prose-li:ml-0 prose-img:my-4 prose-img:rounded-lg prose-img:shadow-md prose-blockquote:my-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic" />
        </div>
        {uploading && <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Mengupload gambar...</div>
          </div>}
      </div>
      <div className="px-3 py-1.5 text-xs text-muted-foreground border-t border-border bg-muted/30">
        💡 Tips: Drag & drop gambar langsung ke editor atau paste dari clipboard
      </div>
    </div>;
};