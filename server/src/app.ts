import express from "express";
import passport from "passport";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import groupRoutes from "./routes/group.routes";
import invitationRoutes from "./routes/invitation.routes";
import expenseRoutes from "./routes/expense.routes";
import userCategoryLimitRoutes from './routes/userCategoryLimit.routes';
import subscriptionRoutes from './routes/subscription.routes';
import categoryRoutes from './routes/category.routes';
import { setupSwagger } from './config/swagger';

import './config/passport';  // Initialize passport strategy
import { logger } from './utils/logger';
import prisma from './config/prismaClient';

const app = express();

// Middleware to log HTTP requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(csrf({ cookie: true }));

// Configure CORS
app.use(cors({
  // origin: process.env.CLIENT_URL, // Allow requests from this origin
  origin: "*",
  credentials: true, // Allow cookies to be sent with requests
}));

app.use(passport.initialize());
app.use("/auth", authRoutes);
app.use("/group", groupRoutes);
app.use("/invitation", invitationRoutes);
app.use("/expense", expenseRoutes);
app.use("/userCategoryLimit", userCategoryLimitRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/category", categoryRoutes);

// Setup Swagger
setupSwagger(app);

app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Internal Server Error');
});

// Gracefully shut down Prisma Client
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
