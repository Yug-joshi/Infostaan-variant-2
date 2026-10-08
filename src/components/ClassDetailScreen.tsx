import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CLASSES } from '../data/classes';

export default function ClassDetailScreen() {
   const { slug } = useParams<{ slug: string }>();
   const navigate = useNavigate();

   const classData = CLASSES.find((item) => item.slug === slug);

   if (!classData) {
      return (
         <div className="min-h-screen flex items-center justify-center px-6 pt-24">
            <div className="text-center">
               <h1 className="text-2xl font-semibold mb-2 text-gray-900">
                  Class not found
               </h1>

               <p className="text-sm text-gray-500 mb-6">
                  The class you are looking for does not exist.
               </p>

               <button
                  onClick={() => navigate('/classes')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
               >
                  Back to Classes
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50/50">
         <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28 pb-20">
            <button
               onClick={() => navigate(-1)}
               className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
               <ArrowLeft className="w-4 h-4" />
               Back
            </button>

            <div className="space-y-8">
               <section>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 mb-4">
                     {classData.region || "Coaching Class"}
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 break-words">
                     {classData.name}
                  </h1>

                  {classData.specializations && (
                     <div className="mt-6 flex flex-wrap gap-2">
                        {classData.specializations.split(',').map((spec, i) => (
                           <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-200 shadow-sm">
                              {spec.trim()}
                           </span>
                        ))}
                     </div>
                  )}
               </section>

               <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                  {classData.area && (
                     <div>
                        <h2 className="text-sm font-medium text-gray-900 mb-1.5">Area</h2>
                        <p className="text-sm text-gray-600 break-words leading-relaxed">
                           {classData.area}
                        </p>
                     </div>
                  )}

                  {classData.streams && (
                     <div>
                        <h2 className="text-sm font-medium text-gray-900 mb-1.5">Streams</h2>
                        <p className="text-sm text-gray-600 break-words leading-relaxed">
                           {classData.streams}
                        </p>
                     </div>
                  )}

                  {classData.contact && classData.contact.toLowerCase() !== '[not specified]' && (
                     <div>
                        <h2 className="text-sm font-medium text-gray-900 mb-1.5">Contact</h2>
                        <p className="text-sm text-gray-600 break-words">
                           {classData.contact}
                        </p>
                     </div>
                  )}

                  {classData.website && classData.website.toLowerCase() !== 'not specified' && (
                     <div>
                        <h2 className="text-sm font-medium text-gray-900 mb-1.5">Website / Profile</h2>
                        <p className="text-sm text-indigo-600 hover:text-indigo-700 break-words">
                           <a href={classData.website.startsWith('http') ? classData.website : `https://${classData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {classData.website}
                           </a>
                        </p>
                     </div>
                  )}

                  {classData.address && classData.address.toLowerCase() !== '[details not specified]' && (
                     <div className="sm:col-span-2 pt-4 border-t border-gray-100">
                        <h2 className="text-sm font-medium text-gray-900 mb-1.5">Address</h2>
                        <p className="text-sm text-gray-600 break-words leading-relaxed">
                           {classData.address}
                        </p>
                     </div>
                  )}
               </section>
            </div>
         </main>
      </div>
   );
}