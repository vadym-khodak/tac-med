resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "access-identity-${var.S3_ORIGIN_ID}.s3.amazonaws.com"
}

resource "aws_cloudfront_distribution" "static_distribution" {
  # depends_on = [aws_acm_certificate_validation.cert]

  origin {
    domain_name = aws_s3_bucket.tac-med-static-assets.bucket_regional_domain_name
    origin_id   = "S3-${var.S3_ORIGIN_ID}"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }
  default_root_object = "index.html"

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "Some Comment"
  aliases             = [var.APP_DOMAIN_NAME]

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    compress         = true
    target_origin_id = "S3-${var.S3_ORIGIN_ID}"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.cloudfront.arn
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
