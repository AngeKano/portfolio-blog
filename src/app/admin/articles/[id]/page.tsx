'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotificationContext } from '../../../../ui/context/NotificationContext';
import { LuSave, LuChevronLeft, LuLoader } from 'react-icons/lu';
import Link from 'next/link';

interface ArticleFormData {
  title: string;
  description: string;
  content: string;
  image?: string;
  published: boolean;
  tags: string[];
}

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    description: '',
    content: '',
    image: '',
    published: false,
    tags: [],
  });
  
  const [originalData, setOriginalData] = useState<ArticleFormData | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { success, error: showError } = useNotificationContext();

  // Charger les données de l'article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/articles/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de l\'article');
        }
        
        const article = await response.json();
        
        const articleData = {
          title: article.title,
          description: article.description,
          content: article.content,
          image: article.image || '',
          published: article.published,
          tags: article.tags || [],
        };
        
        setFormData(articleData);
        setOriginalData(articleData);
      } catch (err) {
        setError('Impossible de charger l\'article');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'published' ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Gérer l'ajout d'un tag
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  // Gérer la suppression d'un tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  // Déterminer si le formulaire a été modifié
  const hasChanges = () => {
    if (!originalData) return false;
    
    return (
      formData.title !== originalData.title ||
      formData.description !== originalData.description ||
      formData.content !== originalData.content ||
      formData.image !== originalData.image ||
      formData.published !== originalData.published ||
      JSON.stringify(formData.tags) !== JSON.stringify(originalData.tags)
    );
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider le formulaire
    const validationErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      validationErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.trim().length < 3) {
      validationErrors.title = 'Le titre doit contenir au moins 3 caractères';
    }
    
    if (!formData.description.trim()) {
      validationErrors.description = 'La description est obligatoire';
    } else if (formData.description.trim().length < 10) {
      validationErrors.description = 'La description doit contenir au moins 10 caractères';
    }
    
    if (!formData.content.trim()) {
      validationErrors.content = 'Le contenu est obligatoire';
    } else if (formData.content.trim().length < 50) {
      validationErrors.content = 'Le contenu doit contenir au moins 50 caractères';
    }
    
    if (formData.image && !/^(https?:\/\/)/.test(formData.image)) {
      validationErrors.image = 'L\'URL de l\'image doit commencer par http:// ou https://';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Si aucune modification n'a été faite, revenir à la liste
    if (!hasChanges()) {
      router.push('/admin/articles');
      return;
    }
    
    // Soumettre le formulaire
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour de l\'article');
      }
      
      success('Article mis à jour avec succès');
      router.push('/admin/articles');
    } catch (err: any) {
      showError(err.message || 'Impossible de mettre à jour l\'article');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <LuLoader className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/admin/articles" className="text-primary-600 hover:text-primary-700">
          Retour à la liste des articles
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <Link
          href="/admin/articles"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <LuChevronLeft className="mr-1" /> Retour à la liste
        </Link>
        
        <h1 className="text-2xl font-bold mt-2">Modifier l'article</h1>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Titre de l'article"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brève description de l'article"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            
            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                URL de l'image
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.image ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="https://exemple.com/image.jpg"
              />
              {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Aperçu"
                    className="max-h-40 rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                  placeholder="Ajouter un tag"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                >
                  Ajouter
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-primary-500 hover:text-primary-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Contenu */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Contenu <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Contenu de l'article en Markdown"
              />
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Le contenu est formaté en Markdown.
              </p>
            </div>
            
            {/* Statut de publication */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                {formData.published ? 'Article publié' : 'Publier l\'article'}
              </label>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 pt-4">
              <Link
                href="/admin/articles"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Annuler
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges()}
                className={`px-4 py-2 rounded-md flex items-center ${
                  hasChanges()
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <LuLoader className="animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <LuSave className="mr-2" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}