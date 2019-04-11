"""empty message

Revision ID: b2a23adbbebe
Revises: 70c095658658
Create Date: 2019-04-10 22:01:35.663375

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2a23adbbebe'
down_revision = '70c095658658'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('projects', sa.Column('last_update_type', sa.String(), nullable=True))
    op.create_index(op.f('ix_projects_last_update_type'), 'projects', ['last_update_type'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_projects_last_update_type'), table_name='projects')
    op.drop_column('projects', 'last_update_type')
    # ### end Alembic commands ###
