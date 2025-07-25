resource "aws_s3_bucket" "tac-med-static-assets" {
  bucket = var.S3_ORIGIN_ID
  force_destroy = true
  tags = {
    Service = "client"
  }
}

resource "aws_s3_bucket_ownership_controls" "bucket_ownership" {
  bucket = aws_s3_bucket.tac-med-static-assets.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "public_access_block" {
  bucket = aws_s3_bucket.tac-med-static-assets.id

  ignore_public_acls = false
  restrict_public_buckets = false
  block_public_acls   = false
  block_public_policy = false
}

resource "aws_s3_bucket_acl" "bucket_acl" {
  depends_on = [
    aws_s3_bucket_public_access_block.public_access_block,
    aws_s3_bucket_ownership_controls.bucket_ownership
  ]
  bucket = aws_s3_bucket.tac-med-static-assets.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "app_static" {
  depends_on = [aws_s3_bucket_public_access_block.public_access_block]
  bucket = aws_s3_bucket.tac-med-static-assets.id
  policy = jsonencode({
    Version = "2008-10-17"
    Id      = "PolicyForCloudFrontPrivateContent"
    Statement = [
      {
        Sid    = "1"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.origin_access_identity.id}"
        },
        Action   = "s3:GetObject",
        Resource = "${aws_s3_bucket.tac-med-static-assets.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket" "tac-med-production-deployments" {
  bucket = var.DEPLOYMENT_BUCKET_NAME
  force_destroy = true
  tags = {
    Service = "server"
  }
}

resource "aws_s3_bucket_ownership_controls" "deployment_bucket_ownership" {
  bucket = aws_s3_bucket.tac-med-production-deployments.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}
