  // infrastructure/db/prisma/seed.ts
  // import { PrismaClient } from '@prisma/client';
  // import { PasswordService } from '../../services/auth/PasswordService';

  // const prisma = new PrismaClient();
  const { PrismaClient } = require('@prisma/client');
  const bcrypt = require('bcryptjs');
  
  const prisma = new PrismaClient();
  
  // Créez une version simplifiée de votre PasswordService
  const PasswordService = {
    async hashPassword(plainPassword) {
      const salt = await bcrypt.genSalt(12);
      return bcrypt.hash(plainPassword, salt);
    }
  };

  async function main() {
    console.log('🌱 Début du seeding de la base de données...');

    // Nettoyer la base de données (en développement uniquement)
    if (process.env.NODE_ENV !== 'production') {
      await cleanDatabase();
    }

    // Créer l'utilisateur admin par défaut
    const hashedPassword = await PasswordService.hashPassword('admin12345');
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Administrateur',
        password: hashedPassword,
        role: 'ADMIN',
        social: {
          github: 'https://github.com/your-username',
          linkedin: 'https://linkedin.com/in/your-profile',
        },
      },
    });
    
    console.log(`🔑 Utilisateur admin créé: ${admin.email}`);

    // Créer quelques compétences
    const skills = [
      { name: 'Next.js', category: 'FRONTEND', tags: ['FRAMEWORK', 'REACT', 'JAVASCRIPT'] },
      { name: 'React', category: 'FRONTEND', tags: ['LIBRARY', 'JAVASCRIPT', 'UI'] },
      { name: 'Node.js', category: 'BACKEND', tags: ['RUNTIME', 'JAVASCRIPT', 'SERVER'] },
      { name: 'PostgreSQL', category: 'DATABASE', tags: ['SQL', 'RELATIONAL'] },
      { name: 'AWS', category: 'DEVOPS', tags: ['CLOUD', 'DEPLOYMENT'] },
      { name: 'Docker', category: 'DEVOPS', tags: ['CONTAINERIZATION', 'DEPLOYMENT'] },
    ];

    for (const skill of skills) {
      await prisma.skill.upsert({
        where: { 
          // Créer un identifiant unique basé sur le nom (dans un environnement réel, utilisez une clé primaire appropriée)
          id: `seeded-${skill.name.toLowerCase().replace(/\s+/g, '-')}` 
        },
        update: skill,
        create: {
          ...skill,
          id: `seeded-${skill.name.toLowerCase().replace(/\s+/g, '-')}`,
        },
      });
    }

    console.log(`📊 ${skills.length} compétences créées`);

    // Créer quelques expériences professionnelles
    const experiences = [
      {
        title: 'Développeur Full-Stack',
        company: 'TechCorp',
        description: 'Développement d\'applications web avec React, Node.js et PostgreSQL.',
        startDate: new Date('2021-01-01'),
        endDate: null, // Emploi actuel
        skills: ['React', 'Node.js', 'PostgreSQL'],
        link: 'https://techcorp.com',
      },
      {
        title: 'Développeur Front-End',
        company: 'WebAgency',
        description: 'Création d\'interfaces utilisateur réactives et attrayantes.',
        startDate: new Date('2019-05-01'),
        endDate: new Date('2020-12-31'),
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        link: 'https://webagency.com',
      },
    ];

    for (const experience of experiences) {
      await prisma.experience.upsert({
        where: { 
          id: `seeded-${experience.company.toLowerCase().replace(/\s+/g, '-')}` 
        },
        update: experience,
        create: {
          ...experience,
          id: `seeded-${experience.company.toLowerCase().replace(/\s+/g, '-')}`,
        },
      });
    }

    console.log(`💼 ${experiences.length} expériences créées`);

    // Créer quelques articles d'exemple
    const articles = [
      {
        title: 'Comment créer un portfolio avec Next.js',
        description: 'Un guide complet pour créer un portfolio moderne avec Next.js et Tailwind CSS.',
        content: `
  # Comment créer un portfolio avec Next.js

  Next.js est un framework React qui vous permet de créer des applications web performantes et optimisées pour le référencement.

  ## Pourquoi choisir Next.js ?

  - **Rendu côté serveur** : Améliore les performances et le SEO
  - **Routage intégré** : Simplification de la navigation
  - **Écosystème riche** : Nombreuses intégrations disponibles

  ## Étapes pour créer votre portfolio

  1. Installer Next.js et configurer le projet
  2. Créer les principales pages et composants
  3. Styliser avec Tailwind CSS
  4. Déployer sur Vercel ou un autre service d'hébergement

  ...et bien plus encore dans cet article !
        `,
        published: true,
        publishedAt: new Date('2025-07-15'),
        links: {
          github: 'https://github.com/example/nextjs-portfolio',
          demo: 'https://portfolio-demo.vercel.app',
        },
        tags: ['Next.js', 'React', 'Portfolio', 'Tutorial'],
        authorId: admin.id,
      },
      {
        title: 'L\'importance de la Clean Architecture dans les projets modernes',
        description: 'Découvrez comment la Clean Architecture peut améliorer la maintenabilité de vos projets.',
        content: `
  # L'importance de la Clean Architecture

  La Clean Architecture est une approche de développement logiciel qui met l'accent sur la séparation des préoccupations et la création de systèmes indépendants des frameworks.

  ## Principes fondamentaux

  - **Indépendance des frameworks** : Votre logique métier ne doit pas dépendre de bibliothèques externes
  - **Testabilité** : Facilite l'écriture de tests unitaires
  - **Indépendance de l'interface utilisateur** : Possibilité de changer l'UI sans modifier la logique

  ## Mise en place dans un projet Next.js

  La structure que nous avons adoptée pour ce portfolio-blog est un excellent exemple de Clean Architecture appliquée à un projet Next.js.

  ...et bien plus encore dans cet article !
        `,
        published: true,
        publishedAt: new Date('2025-09-20'),
        tags: ['Clean Architecture', 'Best Practices', 'Software Design'],
        authorId: admin.id,
      },
    ];

    for (const article of articles) {
      await prisma.article.upsert({
        where: { 
          id: `seeded-${article.title.toLowerCase().substring(0, 20).replace(/\s+/g, '-')}` 
        },
        update: article,
        create: {
          ...article,
          id: `seeded-${article.title.toLowerCase().substring(0, 20).replace(/\s+/g, '-')}`,
        },
      });
    }

    console.log(`📝 ${articles.length} articles créés`);

    // Créer quelques projets d'exemple
    const projects = [
      {
        title: 'Portfolio Blog',
        description: 'Un portfolio personnel et blog avec Next.js, PostgreSQL et Clean Architecture.',
        content: `
  # Portfolio Blog

  Ce projet est un portfolio et blog personnel construit avec les technologies modernes et suivant les principes de la Clean Architecture.

  ## Technologies utilisées

  - **Frontend** : Next.js, React, Tailwind CSS
  - **Backend** : Next.js API Routes, tRPC
  - **Base de données** : PostgreSQL avec Prisma
  - **Authentication** : NextAuth.js

  ## Fonctionnalités

  - Blog avec articles et commentaires
  - Présentation de projets
  - Section compétences
  - Expériences professionnelles
  - Authentification pour admin et visiteurs

  ## Captures d'écran

  [Des captures d'écran seraient incluses ici]
        `,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-03-15'),
        links: {
          github: 'https://github.com/example/portfolio-blog',
          live: 'https://portfolio-blog-example.com',
        },
        technologies: ['Next.js', 'React', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
        tags: ['Portfolio', 'Blog', 'Full-Stack'],
        authorId: admin.id,
      },
      {
        title: 'E-commerce Dashboard',
        description: 'Tableau de bord d\'administration pour une plateforme e-commerce.',
        content: `
  # E-commerce Dashboard

  Un tableau de bord complet pour gérer une boutique en ligne, incluant la gestion des produits, des commandes et des clients.

  ## Technologies utilisées

  - **Frontend** : React avec Redux
  - **Backend** : Node.js, Express
  - **Base de données** : MongoDB
  - **Authentication** : JWT

  ## Fonctionnalités

  - Gestion des produits (CRUD)
  - Suivi des commandes et des statuts
  - Analytique des ventes
  - Gestion des clients

  ## Architecture

  Le projet suit une architecture microservices pour permettre une évolutivité facile et une maintenance simplifiée.

  ## Captures d'écran

  [Des captures d'écran seraient incluses ici]
        `,
        startDate: new Date('2022-06-01'),
        endDate: new Date('2022-11-30'),
        links: {
          github: 'https://github.com/example/ecommerce-dashboard',
        },
        technologies: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB'],
        tags: ['E-commerce', 'Dashboard', 'MERN Stack'],
        authorId: admin.id,
      },
    ];

    for (const project of projects) {
      await prisma.project.upsert({
        where: { 
          id: `seeded-${project.title.toLowerCase().substring(0, 20).replace(/\s+/g, '-')}` 
        },
        update: project,
        create: {
          ...project,
          id: `seeded-${project.title.toLowerCase().substring(0, 20).replace(/\s+/g, '-')}`,
        },
      });
    }

    console.log(`🚀 ${projects.length} projets créés`);

    // Créer quelques visiteurs
    const visitors = [
      { email: 'visitor1@example.com' },
      { email: 'visitor2@example.com' },
      { email: 'visitor3@example.com' },
    ];

    for (const visitor of visitors) {
      await prisma.visitor.upsert({
        where: { email: visitor.email },
        update: {},
        create: visitor,
      });
    }

    console.log(`👥 ${visitors.length} visiteurs créés`);

    console.log('✅ Seeding terminé avec succès!');
  }

  // Fonction pour nettoyer la base de données (à utiliser avec précaution)
  async function cleanDatabase() {
    console.log('🧹 Nettoyage de la base de données...');
    
    // Supprimer les données dans l'ordre approprié pour respecter les contraintes de clé étrangère
    await prisma.comment.deleteMany();
    await prisma.article.deleteMany();
    await prisma.project.deleteMany();
    await prisma.experience.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    await prisma.visitor.deleteMany();
    // Retirer ou commenter cette ligne:
    // await prisma.verificationToken.deleteMany();
    
    console.log('🧹 Nettoyage terminé');
  }

  // Exécuter le seed
  main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
    
//     ------------

//     const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcryptjs');

// const prisma = new PrismaClient();

// // Créez une version simplifiée de votre PasswordService
// const PasswordService = {
//   async hashPassword(plainPassword) {
//     const salt = await bcrypt.genSalt(12);
//     return bcrypt.hash(plainPassword, salt);
//   }
// };

// async function main() {
//   console.log('🌱 Début du seeding de la base de données...');

//   // Le reste du code de votre seed...
//   // Assurez-vous de convertir tout en syntaxe CommonJS
// }

// // Exécuter le seed
// main()
//   .catch((e) => {
//     console.error('❌ Erreur lors du seeding:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });