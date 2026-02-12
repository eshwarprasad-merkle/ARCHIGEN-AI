
--CREATING APP_CONFIG
CREATE TABLE app_config (
    [key]     NVARCHAR(255) NOT NULL ,
    [value]   NVARCHAR(MAX) NOT NULL,
    [comment] NVARCHAR(MAX) NULL
);


 
INSERT 
  INTO app_config 
      ([key],                      [value],                                                                                                      comment)
VALUES('END_POINT',              '',   'OpenAI API Url'), 
      ('SERVICE_LINE',           'cxm',                                                                                                      'x-service-line'), 
      ('BRAND',                  'merkle',                                                                                                   'x-brand'), 
      ('PROJECT',                'Decoding_GenAI',                                                                                           'x-project'), 
      ('OPENAI_API_VERSION',     'v15',                                                                                                      'api-version'), 
      ('OPENAI_API_KEY',         '07bfe94d3612430d94e753fd7e31689b',                                                                         'Ocp-Apim-Subscription-Key'), 
      ('CLOUD',                  'AWS,Azure,GCP',                                                                                            'Cloud Infrastructure'), 
      ('DATA_REF',               'Feed,Initial Load',                                                                                         'Data References'), 
      ('WORK_TYPE',              'New,Modify,Reuse',                                                                                         'Work Types'), 
      ('SOURCE_TYPE',            'API Call,API Publisher,Database,File,IOT',                                                                 'Source Types'), 
      ('SOURCE_MODE',            'Batch,Realtime',																							 'Source Modes'), 
      ('SOURCE_VARIETY',         'Structured,Semi-Structured,Un-Structured',                                                                 'Source Varieties'), 
      ('COMPLEXITY',             'Simple,Moderate,Complex',                                                                                  'Complexity'), 
      ('WORK_TYPE_NEW',          '1',                                                                                                        'New Data Ingestion Pipeline Effort Multiplier'), 
      ('SERVICE_TYPE',           'Data Ingestion,Workflow Orchestration,Data Transformation,Data Warehouse,Data Lake',                       'Cloud Service types'), 
      ('WORK_TYPE_MODIFY',       '0.5',                                                                                                      'Modify existing Data Ingestion Pipeline Effort Multiplier'), 
      ('WORK_TYPE_REUSE',        '0.2',                                                                                                      'Reuse Data Ingestion Pipeline Effort Multiplier'), 
      ('NON_PII_SIMPLE',         '40',                                                                                                       'Simple Non-PII Data Ingestion Pipeline Effort'), 
      ('NON_PII_MODERATE',       '50',                                                                                                       'Moderate Non-PII Data Ingestion Pipeline Effort'), 
      ('NON_PII_COMPLEX',        '64',                                                                                                       'Complex Non-PII Data Ingestion Pipeline Effort'), 
      ('PII_SIMPLE',             '54',                                                                                                       'Simple PII Data Ingestion Pipeline Effort'), 
      ('PII_MODERATE',           '72',                                                                                                       'Moderate PII Data Ingestion Pipeline Effort'), 
      ('PII_COMPLEX',            '86',                                                                                                       'Complex PII Data Ingestion Pipeline Effort'), 
      ('INIT_SIMPLE',            '40',                                                                                                       'Simple Initial Data Migration Effort'), 
      ('INIT_MODERATE',          '80',                                                                                                       'Moderate Initial Data Migration Effort'), 
      ('INIT_COMPLEX',           '120',                                                                                                      'Complex Initial Data Migration Effort'),
      ('MIGRATE_ROW_SIMPLE',     '200000000',                                                                                                'Simple Initial Data Migration Rows'), 
      ('MIGRATE_ROW_MODERATE',   '400000000',                                                                                                'Moderate Initial Data Migration Rows'), 
      ('INGEST_COLUMN_SIMPLE',   '20',                                                                                                       'Simple Data Ingestion Columns'), 
      ('INGEST_COLUMN_MODERATE', '75',                                                                                                       'Moderate Data Ingestion Columns'),
	   ('COUNTRIES', 'India,USA,UK',                                                                                                       'Countries');
;

--CREATE TECH STACK TABLE

CREATE TABLE tech_stack (
    cloud        NVARCHAR(255),
    service      NVARCHAR(255) NOT NULL,
    source_type  NVARCHAR(255),   
    mode         NVARCHAR(255),
    tool         NVARCHAR(255) NOT NULL,
    description  NVARCHAR(255) NOT NULL
);



INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'API Call', 'Batch', 'AWS Data Pipeline', 'a web service for orchestrating and automating the movement and transformation of data between different AWS services in batch mode');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'API Publisher', 'Realtime', 'Amazon Kinesis Data Firehose', 'Capture, transform, and load streaming data into AWS data stores for real-time analytics');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'API Publisher', 'Realtime', 'Amazon Kinesis Data Streams', 'Collect and process large streams of data records in real time');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'API Publisher', 'Realtime', 'Amazon Managed Streaming for Apache Kafka (Amazon MSK)', 'Build and run applications that use Apache Kafka to process streaming data');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'Database', 'Realtime', 'Amazon Kinesis', 'Real-time data streaming service');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'Database', 'Realtime', 'Amazon Managed Streaming for Apache Kafka (Amazon MSK)', 'Fully managed Apache Kafka service');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'Database', 'Batch', 'AWS Data Pipeline', 'AWS Data Pipeline is a web service for orchestrating and automating the movement and transformation of data.');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'Database', 'Realtime', 'AWS Database Migration  Service', 'Migrate databases to AWS quickly and securely');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'Database', 'Batch', 'AWS Database Migration Service', 'AWS Database Migration Service helps you migrate databases to AWS quickly and securely.');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'Database', 'Batch', 'AWS Glue', 'AWS Glue is a fully managed extract, transform, and load (ETL) service that makes it easy to prepare and load data for analytics.');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'File', 'Realtime', 'Amazon Kinesis Data Firehose', 'Kinesis Data Firehose can capture, transform, and load streaming data into AWS data stores like S3, Redshift, and Elasticsearch.');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'File', 'Batch', 'AWS Batch', 'Fully managed batch processing service to run batch computing workloads in the AWS cloud');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'File', 'Batch', 'AWS Data Pipeline', 'Orchestration service to move data between AWS services and on-premises data sources');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'File', 'Batch', 'AWS Glue', 'Fully managed ETL service to prepare and load data into data lakes');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'IOT', 'Realtime', 'Amazon Kinesis Data Firehose', 'Service that can capture, transform, and load streaming data into Amazon S3, Amazon Redshift, Amazon Elasticsearch Service, and Splunk');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'IOT', 'Realtime', 'Amazon Kinesis Data Streams', 'Real-time data streaming service designed to ingest and process large streams of data records in real time');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'IOT', 'Realtime', 'Amazon Managed Streaming for Apache Kafka (MSK)', 'Fully managed Kafka service that makes it easy for you to build and run applications that use Apache Kafka as a data store');
INSERT INTO tech_stack VALUES ('AWS', 'Data Ingestion', 'IOT', 'Realtime', 'AWS IoT Core', 'Managed cloud service that lets connected devices easily and securely interact with cloud applications and other devices');
INSERT INTO tech_stack VALUES ('AWS', 'Data Lake', '', '', 'Amazon S3', 'Object storage service that offers industry-leading scalability, data availability, security, and performance.');
INSERT INTO tech_stack VALUES ('AWS', 'Data Transformation', '', '', 'Amazon EMR (Elastic MapReduce)', 'Managed big data platform for processing and analyzing large datasets');
INSERT INTO tech_stack VALUES ('AWS', 'Data Transformation', '', '', 'AWS Data Pipeline', 'Orchestration service for moving data between different AWS services');
INSERT INTO tech_stack VALUES ('AWS', 'Data Transformation', '', '', 'AWS DMS (Database Migration Service)', 'Service for migrating databases to AWS quickly and securely');
INSERT INTO tech_stack VALUES ('AWS', 'Data Transformation', '', '', 'AWS Glue', 'Fully managed extract, transform, and load (ETL) service');
INSERT INTO tech_stack VALUES ('AWS', 'Data Warehouse', '', '', 'Amazon Redshift', 'A fully managed data warehouse service in the cloud');
INSERT INTO tech_stack VALUES ('AWS', 'Workflow Orchestration', '', '', 'Amazon MWAA', 'Managed Workflows for Apache Airflow');
INSERT INTO tech_stack VALUES ('AWS', 'Workflow Orchestration', '', '', 'Amazon Simple Workflow Service (SWF)', 'Coordinate work across distributed application components.');
INSERT INTO tech_stack VALUES ('AWS', 'Workflow Orchestration', '', '', 'AWS Step Functions', 'Coordinate multiple AWS services into serverless workflows.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'API Call', 'Batch', 'Azure Data Factory', 'Cloud-based data integration service that allows you to create, schedule, and manage data pipelines');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'API Publisher', 'Realtime', 'Azure Event Hubs', 'A real-time data ingestion service that can ingest and process millions of events per second.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'API Publisher', 'Realtime', 'Azure Stream Analytics', 'Provides real-time analytics and insights from streaming data.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'Database', 'Batch', 'Azure Data Factory', 'Fully managed ETL service for orchestrating and automating data movement and data transformation');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'Database', 'Realtime', 'Azure Event Hubs', 'A big data streaming platform and event ingestion service that helps you to collect, process and store events in real-time.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'Database', 'Realtime', 'Azure SQL Database Sync', 'Service to synchronize data across multiple Azure SQL databases and on-premises SQL Server databases.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'Database', 'Realtime', 'Azure Stream Analytics', 'Real-time analytics service to analyze events and data streams as they happen, enabling you to extract insights from data.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'File', 'Batch', 'Azure Data Factory', 'Fully managed data integration service that allows you to create, schedule, and manage data pipelines for ingesting data from various sources including Files.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'File', 'Batch', 'Azure Databricks', 'Unified analytics platform that provides an environment for running data engineering workloads including data ingestion from Files using Apache Spark.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'File', 'Realtime', 'Azure Event Hubs', 'Azure Event Hubs is a scalable event processing service that can ingest millions of events per second to enable real-time data streaming.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'File', 'Realtime', 'Azure Stream Analytics', 'Azure Stream Analytics is a real-time analytics service that allows you to process and analyze streaming data in real time.');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'IOT', 'Realtime', 'Azure Event Hubs', 'Ingest and process massive streams of data in real time');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'IOT', 'Realtime', 'Azure IoT Hub', 'Securely connect, monitor, and manage IoT devices');
INSERT INTO tech_stack VALUES ('Azure', 'Data Ingestion', 'IOT', 'Realtime', 'Azure Stream Analytics', 'Real-time data streaming and event processing');
INSERT INTO tech_stack VALUES ('Azure', 'Data Lake', '', '', 'Azure Data Lake Storage Gen2', 'Hadoop Distributed File System and Azure Blob Storage');
INSERT INTO tech_stack VALUES ('Azure', 'Data Transformation', '', '', 'Azure Data Box', 'Secure data transfer service using physical storage devices');
INSERT INTO tech_stack VALUES ('Azure', 'Data Transformation', '', '', 'Azure Data Factory', 'Orchestration service that allows data movement and transformation');
INSERT INTO tech_stack VALUES ('Azure', 'Data Transformation', '', '', 'Azure Data Lake Analytics', 'Distributed analytics service for big data and complex processing');
INSERT INTO tech_stack VALUES ('Azure', 'Data Transformation', '', '', 'Azure HDInsight', 'Managed Apache Hadoop, Spark, and more in the cloud');
INSERT INTO tech_stack VALUES ('Azure', 'Data Transformation', '', '', 'Azure Stream Analytics', 'Real-time analytics on streaming data');
INSERT INTO tech_stack VALUES ('Azure', 'Data Transformation', '', '', 'Azure Synapse Analytics', 'Analytics service that brings together big data and data warehousing');
INSERT INTO tech_stack VALUES ('Azure', 'Data Warehouse', '', '', 'Azure SQL Data Warehouse', 'Enterprise-class distributed database capable of processing and querying large volumes of data');
INSERT INTO tech_stack VALUES ('Azure', 'Data Warehouse', '', '', 'Azure Synapse Analytics', 'Fully managed data integration and analytics service to analyze large volumes of data');
INSERT INTO tech_stack VALUES ('Azure', 'Workflow Orchestration', '', '', 'Azure Data Factory', 'Orchestrate and automate data workflows at scale');
INSERT INTO tech_stack VALUES ('Azure', 'Workflow Orchestration', '', '', 'Azure Logic Apps', 'Automate workflows and integrate apps/services across Azure and other platforms');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'API Call', 'Batch', 'BigQuery Data Transfer Service', 'Automate loading data into BigQuery from GCP services or third-party data sources');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'API Call', 'Batch', 'Dataflow', 'A fully managed service for ingesting, transforming, and enriching data in real time');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'API Publisher', 'Realtime', 'Cloud Dataflow', 'A fully managed stream and batch data processing service that ingests, transforms, and loads data in real-time.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'API Publisher', 'Realtime', 'Cloud Functions', 'A serverless compute service that can be used to trigger actions based on data ingestion events and process data in real-time.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'API Publisher', 'Realtime', 'Cloud Pub/Sub', 'A messaging service that allows for the decoupling of services and the ingestion of data in real-time.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'Database', 'Realtime', 'Cloud Dataflow', 'A fully managed service for transforming and enriching data in real time');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'Database', 'Realtime', 'Cloud Pub/Sub', 'A messaging service for real-time and reliable messaging between independent applications');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'Database', 'Batch', 'Cloud Storage Transfer Service', 'Transfer data to and from Cloud Storage and other locations');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'Database', 'Batch', 'Data Transfer Service', 'Transfer data from on-premises sources to Google Cloud');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'Database', 'Batch', 'Dataflow', 'Stream and batch data processing service to build data pipelines');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'Database', 'Realtime', 'Datastream', 'Datastream');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'File', 'Batch', 'BigQuery Data Transfer Service', 'A service for transferring data from various sources into BigQuery, can be used to load data in batch mode');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'File', 'Realtime', 'Cloud Dataflow', 'Unified stream and batch data processing service with autoscaling and serverless capabilities');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'File', 'Realtime', 'Cloud Pub/Sub', 'Real-time messaging service for event ingestion and delivery');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'File', 'Batch', 'Dataflow', 'A fully managed service for stream and batch processing, can be used to load data in batch mode from On-Prem');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'File', 'Batch', 'Dataproc', 'A fast, easy-to-use, fully managed cloud service for running Apache Spark and Apache Hadoop clusters, can be used to load and process data in batch mode');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'File', 'Batch', 'Transfer Appliance', 'A hardware appliance used to securely migrate large volumes of data into Google Cloud Platform, can be used to load data in batch mode from On-Prem');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'IOT', 'Realtime', 'Cloud Dataflow', 'A fully managed service for real-time data processing and ingestion.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'IOT', 'Realtime', 'Cloud IoT Core', 'Fully managed service to securely connect, manage, and ingest data from IoT devices.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Ingestion', 'IOT', 'Realtime', 'Cloud Pub/Sub', 'A messaging service that allows you to ingest event streams from your IoT devices in real-time.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Lake', '', '', 'Cloud Storage', 'Object storage service for storing and accessing unstructured data');
INSERT INTO tech_stack VALUES ('GCP', 'Data Transformation', '', '', 'BigQuery Data Transfer Service', 'Automate and schedule data transfers from SaaS applications like Google Analytics, Google Ads, YouTube, and more into BigQuery.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Transformation', '', '', 'Cloud Dataflow', 'A fully managed, serverless way to execute Apache Beam pipelines for batch and stream data processing.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Transformation', '', '', 'Cloud Dataprep', 'A managed data preparation tool that makes it easy to clean and prepare data for analysis or machine learning.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Transformation', '', '', 'Cloud Dataproc', 'A fast, easy-to-use and fully managed cloud service for running Apache Spark and Apache Hadoop clusters.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Transformation', '', '', 'Data Fusion', 'A fully managed data integration service that helps you efficiently build and manage ETL/ELT data pipelines.');
INSERT INTO tech_stack VALUES ('GCP', 'Data Warehouse', '', '', 'BigQuery', 'Serverless, highly scalable, and cost-effective multi-cloud data warehouse designed for business agility.');
INSERT INTO tech_stack VALUES ('GCP', 'Workflow Orchestration', '', '', 'Cloud Composer', 'Workflow orchestration service built on Apache Airflow');
INSERT INTO tech_stack VALUES ('GCP', 'Workflow Orchestration', '', '', 'Cloud Workflows', 'Serverless workflow orchestration service');
INSERT INTO tech_stack VALUES ('', 'Data Ingestion', 'File', 'Batch', 'MFT', 'MFT');
INSERT INTO tech_stack VALUES ('', 'Data Ingestion', 'File', 'Batch', 'SFTP', 'SFTP');
INSERT INTO tech_stack VALUES ('', 'Data Transformation', '', '', 'Databricks', 'Unified analytics platform for big data and machine learning');
INSERT INTO tech_stack VALUES ('', 'Data Warehouse', '', '', 'Snowflake', 'Cloud-based data warehouse service with support for diverse workloads');
INSERT INTO tech_stack VALUES ('', 'Workflow Orchestration', '', '', 'Apache Airflow', 'Apache Airflow');

-- Fixing NUlls 
UPDATE tech_stack
SET cloud = NULL
WHERE LTRIM(RTRIM(CAST(cloud AS NVARCHAR(255)))) = '';

UPDATE tech_stack
SET source_type= NULL
WHERE LTRIM(RTRIM(CAST(source_type AS NVARCHAR(255)))) = '';

UPDATE tech_stack
SET mode = NULL
WHERE LTRIM(RTRIM(CAST(mode AS NVARCHAR(255)))) = '';



--END TO END PIPELINE TABLE

create table end_to_end_pipeline_stacks
(

    cloud                     VARCHAR(50),
    source_type               VARCHAR(50),
    mode                      VARCHAR(50),
    ingestion_tool            VARCHAR(100),
    orchestration_tool        VARCHAR(100),
    transformation_tool       VARCHAR(100),
    data_warehouse			  VARCHAR(100),
    data_lakehouse			  VARCHAR(100)

);

INSERT INTO end_to_end_pipeline_stacks
SELECT 
      e.cloud
    , a.source_type
    , a.mode
    , a.tool AS ingestion_tool
    , b.tool AS orchestration_tool
    , c.tool AS transformation_tool
    , d.tool AS data_warehouse
    , e.tool AS data_lakehouse
FROM tech_stack a
   , tech_stack b
   , tech_stack c
   , tech_stack d
   , tech_stack e
WHERE a.service = 'Data Ingestion'
  AND b.service = 'Workflow Orchestration'
  AND c.service = 'Data Transformation'
  AND d.service = 'Data Warehouse'
  AND e.service = 'Data Lake'
  AND e.cloud = ISNULL(a.cloud, e.cloud)
  AND e.cloud = ISNULL(b.cloud, e.cloud)
  AND e.cloud = ISNULL(c.cloud, e.cloud)
  AND e.cloud = ISNULL(d.cloud, e.cloud);
