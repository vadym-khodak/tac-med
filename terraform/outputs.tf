output "nameservers" {
  description = "Nameservers for the Route53 zone - use these in your DNS provider"
  value = aws_route53_zone.root.name_servers
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain name"
  value = aws_cloudfront_distribution.static_distribution.domain_name
}

output "exec_lambda_role" {
  value = aws_iam_role.exec_lambda.arn
}

output "hosted_zone_id" {
  description = "Route53 hosted zone ID"
  value = aws_route53_zone.root.zone_id
}
