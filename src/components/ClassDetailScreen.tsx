import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CLASSES } from '../data/classes';

export default function ClassDetailScreen() {
   const { slug } = useParams<{ slug: string }>();
   const navigate = useNavigate();

   const classData = CLASSES.find((item) => item.slug === slug);

   if (!classData) {
      return (
         <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center">
               <h1 className="text-2xl font-semibold mb-2">
                  Class not found
               </h1>

               <p className="text-sm text-muted-foreground mb-6">
                  The class you are looking for does not exist.
               </p>

               <button
                  onClick={() => navigate('/classes')}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
               >
                  Back to Classes
               </button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen">
         <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
               onClick={() => navigate(-1)}
               className="inline-flex items-center gap-2 mb-8 text-sm text-muted-foreground hover:text-foreground"
            >
               <ArrowLeft className="w-4 h-4" />
               Back
            </button>

            <div className="space-y-8">
               <section>
                  <p className="text-sm text-muted-foreground mb-2">
                     Coaching Class
                  </p>

                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                     {classData.name}
                  </h1>

                  {classData.specializations && (
                     <p className="mt-3 text-muted-foreground">
                        {classData.specializations}
                     </p>
                  )}
               </section>

               <section className="space-y-4">
                  {classData.address && (
                     <div>
                        <h2 className="font-medium">Address</h2>
                        <p className="text-muted-foreground mt-1">
                           {classData.address}
                        </p>
                     </div>
                  )}

                  {classData.area && (
                     <div>
                        <h2 className="font-medium">Area</h2>
                        <p className="text-muted-foreground mt-1">
                           {classData.area}
                        </p>
                     </div>
                  )}

                  {classData.streams && (
                     <div>
                        <h2 className="font-medium">Streams</h2>
                        <p className="text-muted-foreground mt-1">
                           {classData.streams}
                        </p>
                     </div>
                  )}
               </section>
            </div>
         </main>
      </div>
   );
}