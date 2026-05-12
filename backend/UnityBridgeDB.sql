USE [master]
GO
/****** Object:  Database [UnityBridgeDB]    Script Date: 4/28/2026 1:20:14 AM ******/
CREATE DATABASE [UnityBridgeDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'UnityBridgeDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\UnityBridgeDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'UnityBridgeDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL17.SQLEXPRESS\MSSQL\DATA\UnityBridgeDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [UnityBridgeDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [UnityBridgeDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [UnityBridgeDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [UnityBridgeDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET  DISABLE_BROKER 
GO
ALTER DATABASE [UnityBridgeDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [UnityBridgeDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [UnityBridgeDB] SET  MULTI_USER 
GO
ALTER DATABASE [UnityBridgeDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [UnityBridgeDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [UnityBridgeDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [UnityBridgeDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [UnityBridgeDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [UnityBridgeDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [UnityBridgeDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [UnityBridgeDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [UnityBridgeDB]
GO
/****** Object:  Table [dbo].[HelpResponses]    Script Date: 4/28/2026 1:20:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HelpResponses](
	[ResponseID] [int] IDENTITY(1,1) NOT NULL,
	[PostID] [int] NOT NULL,
	[HelperID] [int] NOT NULL,
	[ResponseStatus] [varchar](20) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ResponseID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Posts]    Script Date: 4/28/2026 1:20:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Posts](
	[PostID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [int] NOT NULL,
	[Title] [varchar](150) NOT NULL,
	[Description] [varchar](max) NOT NULL,
	[PostType] [varchar](10) NOT NULL,
	[Status] [varchar](20) NULL,
	[ZipCode] [varchar](10) NOT NULL,
	[CreatedAt] [datetime] NULL,
	[AcceptedResponseID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[PostID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reports]    Script Date: 4/28/2026 1:20:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reports](
	[ReportID] [int] IDENTITY(1,1) NOT NULL,
	[ReportedBy] [int] NOT NULL,
	[ReportedUserID] [int] NULL,
	[PostID] [int] NULL,
	[Reason] [varchar](max) NOT NULL,
	[Status] [varchar](20) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ReportID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reviews]    Script Date: 4/28/2026 1:20:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reviews](
	[ReviewID] [int] IDENTITY(1,1) NOT NULL,
	[ReviewerID] [int] NOT NULL,
	[ReviewedUserID] [int] NOT NULL,
	[ResponseID] [int] NOT NULL,
	[Rating] [int] NOT NULL,
	[Comment] [varchar](max) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ReviewID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 4/28/2026 1:20:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](50) NOT NULL,
	[LastName] [varchar](50) NOT NULL,
	[FullName]  AS (([FirstName]+' ')+[LastName]),
	[Email] [varchar](100) NOT NULL,
	[PasswordHash] [varchar](255) NOT NULL,
	[ZipCode] [varchar](10) NOT NULL,
	[PreferredPhone] [varchar](20) NULL,
	[UserRole] [varchar](20) NULL,
	[CreatedAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[HelpResponses] ADD  DEFAULT ('Pending') FOR [ResponseStatus]
GO
ALTER TABLE [dbo].[HelpResponses] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT ('Open') FOR [Status]
GO
ALTER TABLE [dbo].[Posts] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Reports] ADD  DEFAULT ('Pending') FOR [Status]
GO
ALTER TABLE [dbo].[Reports] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Reviews] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('GeneralUser') FOR [UserRole]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[HelpResponses]  WITH CHECK ADD FOREIGN KEY([HelperID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[HelpResponses]  WITH CHECK ADD FOREIGN KEY([PostID])
REFERENCES [dbo].[Posts] ([PostID])
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD FOREIGN KEY([UserID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD  CONSTRAINT [FK_Posts_AcceptedResponse] FOREIGN KEY([AcceptedResponseID])
REFERENCES [dbo].[HelpResponses] ([ResponseID])
GO
ALTER TABLE [dbo].[Posts] CHECK CONSTRAINT [FK_Posts_AcceptedResponse]
GO
ALTER TABLE [dbo].[Reports]  WITH CHECK ADD FOREIGN KEY([PostID])
REFERENCES [dbo].[Posts] ([PostID])
GO
ALTER TABLE [dbo].[Reports]  WITH CHECK ADD FOREIGN KEY([ReportedBy])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Reports]  WITH CHECK ADD FOREIGN KEY([ReportedUserID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD FOREIGN KEY([ResponseID])
REFERENCES [dbo].[HelpResponses] ([ResponseID])
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD FOREIGN KEY([ReviewerID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD FOREIGN KEY([ReviewedUserID])
REFERENCES [dbo].[Users] ([UserID])
GO
ALTER TABLE [dbo].[HelpResponses]  WITH CHECK ADD CHECK  (([ResponseStatus]='Rejected' OR [ResponseStatus]='Accepted' OR [ResponseStatus]='Pending'))
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD CHECK  (([PostType]='Offer' OR [PostType]='Request'))
GO
ALTER TABLE [dbo].[Posts]  WITH CHECK ADD CHECK  (([Status]='Closed' OR [Status]='Completed' OR [Status]='Open'))
GO
ALTER TABLE [dbo].[Reports]  WITH CHECK ADD CHECK  (([Status]='Resolved' OR [Status]='Reviewed' OR [Status]='Pending'))
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD CHECK  (([Rating]>=(1) AND [Rating]<=(5)))
GO
USE [master]
GO
ALTER DATABASE [UnityBridgeDB] SET  READ_WRITE 
GO



CREATE TABLE IF NOT EXISTS Requests (
  RequestID   INT AUTO_INCREMENT PRIMARY KEY,
  Username    VARCHAR(100)  NOT NULL,
  ContactInfo VARCHAR(150)  NOT NULL,
  Title       VARCHAR(200)  NOT NULL,
  Description TEXT          NOT NULL,
  Category    ENUM('food', 'shelter', 'transport', 'clothing', 'medical', 'other') NOT NULL,
  Location    VARCHAR(200)  NOT NULL,
  Status      ENUM('open', 'fulfilled') DEFAULT 'open',
  CreatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE IF NOT EXISTS Offers (
  OfferID     INT AUTO_INCREMENT PRIMARY KEY,
  Username    VARCHAR(100)  NOT NULL,
  ContactInfo VARCHAR(150)  NOT NULL,
  Title       VARCHAR(200)  NOT NULL,
  Description TEXT          NOT NULL,
  Category    ENUM('food', 'shelter', 'transport', 'clothing', 'medical', 'other') NOT NULL,
  Location    VARCHAR(200)  NOT NULL,
  Status      ENUM('available', 'claimed') DEFAULT 'available',
  CreatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
