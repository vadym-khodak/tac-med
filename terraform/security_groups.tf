resource "aws_security_group" "tac-med-lambda-sg" {
  name        = "tac-med-lambda-sg"
  description = "Security group for Lambda functions"
  vpc_id      = aws_vpc.tac-med-vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
      Name = "tac-med-lambda-sg"
      Service = "server"
    }
}

