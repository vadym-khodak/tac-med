resource "aws_iam_role" "exec_lambda" {
  name = "exec_lambda"
  path = "/"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = [
            "lambda.amazonaws.com"
          ]
        },
        Action = "sts:AssumeRole"
      },
    ]
  })
  tags = {
    Service     = "server"
  }
}
resource "aws_iam_policy" "exec_lambda_policy" {
  name        = "exec_lambda_policy"
  description = "Lambda policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "lambda:InvokeFunction",
        ],
        Resource = "*"
      },
    ]
  })
  tags = {
    Service     = "server"
  }
}

resource "aws_iam_role_policy_attachment" "attach_role" {
  role       = aws_iam_role.exec_lambda.name
  policy_arn = aws_iam_policy.exec_lambda_policy.arn
}

resource "aws_iam_user" "github_actions" {
  name = "github"
}

resource "aws_iam_policy" "github_actions_deployment" {
  name        = "github_actions_deployment_policy"
  description = "Policy for GitHub Actions to deploy the application"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:DeleteObject",
          "s3:GetBucketLocation",
          "s3:ListBucketVersions",
          "s3:PutObjectAcl",
          "s3:GetObjectVersion"
        ],
        Resource = [
          "${aws_s3_bucket.tac-med-production-deployments.arn}",
          "${aws_s3_bucket.tac-med-production-deployments.arn}/*",
          "${aws_s3_bucket.tac-med-static-assets.arn}",
          "${aws_s3_bucket.tac-med-static-assets.arn}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:PublishVersion",
          "lambda:CreateAlias",
          "lambda:UpdateAlias",
          "lambda:DeleteFunction",
          "lambda:GetFunction",
          "lambda:CreateFunction",
          "lambda:ListVersionsByFunction",
          "lambda:GetFunctionConfiguration",
          "lambda:ListTags",
          "lambda:TagResource",
          "lambda:UntagResource",
          "lambda:AddPermission",
          "lambda:RemovePermission",
          "lambda:InvokeFunction"
        ],
        Resource = "arn:aws:lambda:${var.AWS_REGION}:${data.aws_caller_identity.current.account_id}:function:*"
      },
      {
        Effect = "Allow",
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ],
        Resource = aws_cloudfront_distribution.static_distribution.arn
      },
      {
        Effect = "Allow",
        Action = [
          "apigateway:GET",
          "apigateway:POST",
          "apigateway:PUT",
          "apigateway:DELETE",
          "apigateway:PATCH"
        ],
        Resource = [
          "arn:aws:apigateway:${var.AWS_REGION}::/domainnames",
          "arn:aws:apigateway:${var.AWS_REGION}::/domainnames/*",
          "arn:aws:apigateway:${var.AWS_REGION}::/restapis",
          "arn:aws:apigateway:${var.AWS_REGION}::/restapis/*",
          "arn:aws:apigateway:${var.AWS_REGION}::/tags/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "cloudformation:CreateStack",
          "cloudformation:UpdateStack",
          "cloudformation:DeleteStack",
          "cloudformation:DescribeStacks",
          "cloudformation:ListStacks",
          "cloudformation:DescribeStackEvents",
          "cloudformation:GetTemplateSummary",
          "cloudformation:DescribeStackResource",
          "cloudformation:DescribeStackResources",
          "cloudformation:CreateChangeSet",
          "cloudformation:ExecuteChangeSet",
          "cloudformation:DeleteChangeSet",
          "cloudformation:ListChangeSets",
          "cloudformation:DescribeChangeSet",
          "cloudformation:SetStackPolicy",
          "cloudformation:ValidateTemplate"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "iam:PassRole",
          "iam:GetRole",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:GetRolePolicy"
        ],
        Resource = [
          aws_iam_role.exec_lambda.arn,
          "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/server-*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DeleteLogGroup",
          "logs:DeleteLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents",
          "logs:TagResource",
          "logs:UntagResource",
          "logs:ListTagsLogGroup"
        ],
        Resource = "*"
      }
    ]
  })

  tags = {
    Service     = "github-actions"
    Environment = "production"
  }
}

# Additional policy for CloudFormation operations
resource "aws_iam_policy" "cloudformation_deployment" {
  name        = "cloudformation_deployment_policy"
  description = "Policy for CloudFormation operations"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "cloudformation:*"
        ],
        Resource = "*"
      }
    ]
  })

  tags = {
    Service     = "github-actions"
    Environment = "production"
  }
}

# Additional policy for CloudWatch Logs operations
resource "aws_iam_policy" "cloudwatch_logs_policy" {
  name        = "cloudwatch_logs_policy"
  description = "Policy for CloudWatch Logs operations"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DeleteLogGroup",
          "logs:DeleteLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents",
          "logs:TagResource",
          "logs:UntagResource",
          "logs:ListTagsLogGroup"
        ],
        Resource = [
          "arn:aws:logs:${var.AWS_REGION}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/*",
          "arn:aws:logs:${var.AWS_REGION}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/*:*"
        ]
      }
    ]
  })

  tags = {
    Service     = "github-actions"
    Environment = "production"
  }
}

# Get current AWS account ID
data "aws_caller_identity" "current" {}

resource "aws_iam_user_policy_attachment" "attach_deployment" {
  user       = aws_iam_user.github_actions.name
  policy_arn = aws_iam_policy.github_actions_deployment.arn
}

resource "aws_iam_user_policy_attachment" "attach_cloudformation" {
  user       = aws_iam_user.github_actions.name
  policy_arn = aws_iam_policy.cloudformation_deployment.arn
}
